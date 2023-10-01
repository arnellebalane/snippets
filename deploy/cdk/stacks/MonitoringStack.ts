import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as synthetics from '@aws-cdk/aws-synthetics-alpha';
import { Construct } from 'constructs';

interface MonitoringStackProps extends cdk.StackProps {
    distributionLoggingBucket: s3.Bucket;
}

export class MonitoringStack extends cdk.Stack {
    distributionLoggingBucket: s3.Bucket;

    canary: synthetics.Canary;
    canarySuccessMetric: cloudwatch.Metric;
    frontendRequestsMetric: cloudwatch.Metric;
    apiRequestsMetric: cloudwatch.Metric;
    apiGwCountMetric: cloudwatch.Metric;
    apiGw4xxErrorMetric: cloudwatch.Metric;
    apiGw5xxErrorMetric: cloudwatch.Metric;
    availabilityAlarm: cloudwatch.Alarm;
    dashboard: cloudwatch.Dashboard;

    constructor(scope: Construct, id: string, props: MonitoringStackProps) {
        super(scope, id, props);

        this.distributionLoggingBucket = props.distributionLoggingBucket;

        this.setupCanary();
        this.setupMetrics();
        this.setupAvailabilityAlarm();
        this.setupDashboard();
    }

    setupCanary() {
        this.canary = new synthetics.Canary(this, 'Synthetics-HeartbeatCanary', {
            canaryName: 'snippets-heartbeat',
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
            schedule: synthetics.Schedule.rate(cdk.Duration.hours(1)),
            test: synthetics.Test.custom({
                code: synthetics.Code.fromAsset(path.join(__dirname, '../functions/heartbeat-canary')),
                handler: 'index.handler',
            }),
            artifactsBucketLocation: {
                bucket: this.distributionLoggingBucket,
                prefix: 'heartbeat-canary',
            },
            environmentVariables: {
                SNIPPETS_CLIENT_URL: process.env.SNIPPETS_CLIENT_URL || '',
                SNIPPETS_SEED_HASH: process.env.SNIPPETS_SEED_HASH || '',
                SNIPPETS_SEED_BODY: process.env.SNIPPETS_SEED_BODY || '',
            },
        });
    }

    setupMetrics() {
        this.canarySuccessMetric = new cloudwatch.Metric({
            metricName: 'SuccessPercent',
            namespace: 'CloudWatchSynthetics',
            dimensionsMap: {
                CanaryName: this.canary.canaryName,
            },
            statistic: cloudwatch.Stats.AVERAGE,
            label: 'SuccessPercent',
            period: cdk.Duration.hours(1),
        });
        this.frontendRequestsMetric = new cloudwatch.Metric({
            metricName: 'FrontendRequestsCount',
            namespace: 'CloudFrontHttpRequests',
            statistic: cloudwatch.Stats.SAMPLE_COUNT,
            label: 'FrontendRequestsCount',
            period: cdk.Duration.hours(1),
        });
        this.apiRequestsMetric = new cloudwatch.Metric({
            metricName: 'ApiRequestsCount',
            namespace: 'CloudFrontHttpRequests',
            statistic: cloudwatch.Stats.SAMPLE_COUNT,
            label: 'ApiRequestsCount',
            period: cdk.Duration.hours(1),
        });
        this.apiGwCountMetric = new cloudwatch.Metric({
            metricName: 'Count',
            namespace: 'AWS/ApiGateway',
            dimensionsMap: {
                ApiName: 'SnippetsBackendApi',
            },
            statistic: cloudwatch.Stats.SUM,
            label: 'RequestCount',
            period: cdk.Duration.hours(1),
        });
        this.apiGw4xxErrorMetric = new cloudwatch.Metric({
            metricName: '4XXError',
            namespace: 'AWS/ApiGateway',
            dimensionsMap: {
                ApiName: 'SnippetsBackendApi',
            },
            statistic: cloudwatch.Stats.SUM,
            label: '4XXError',
            period: cdk.Duration.hours(1),
        });
        this.apiGw5xxErrorMetric = new cloudwatch.Metric({
            metricName: '5XXError',
            namespace: 'AWS/ApiGateway',
            dimensionsMap: {
                ApiName: 'SnippetsBackendApi',
            },
            statistic: cloudwatch.Stats.SUM,
            label: '5XXError',
            period: cdk.Duration.hours(1),
        });
    }

    setupAvailabilityAlarm() {
        this.availabilityAlarm = new cloudwatch.Alarm(this, 'CW-AvailabilityAlarm', {
            alarmName: 'SnippetsFrontendAvailability',
            metric: this.canarySuccessMetric,
            threshold: 99,
            evaluationPeriods: 1,
            datapointsToAlarm: 1,
            comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });
    }

    setupDashboard() {
        this.dashboard = new cloudwatch.Dashboard(this, 'CW-Dashboard', {
            dashboardName: 'Snippets',
            defaultInterval: cdk.Duration.days(1),
        });

        this.dashboard.addWidgets(
            new cloudwatch.GraphWidget({
                width: 12,
                height: 10,
                title: 'HeartBeatCanarySuccessPercentage',
                left: [this.canarySuccessMetric],
                leftAnnotations: [this.availabilityAlarm.toAnnotation()],
            }),
            new cloudwatch.GraphWidget({
                width: 12,
                height: 10,
                title: 'CloudFrontRequestsCount',
                left: [this.frontendRequestsMetric, this.apiRequestsMetric],
            }),
            new cloudwatch.GraphWidget({
                width: 12,
                height: 10,
                title: 'ApiGatewayRequestsCount',
                left: [this.apiGwCountMetric, this.apiGw4xxErrorMetric, this.apiGw5xxErrorMetric],
            })
        );
    }
}
