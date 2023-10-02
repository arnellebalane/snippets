import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as synthetics from '@aws-cdk/aws-synthetics-alpha';
import { Construct } from 'constructs';

interface MonitoringStackProps extends cdk.StackProps {
    loggingBucket: s3.Bucket;
    backendApiGateway: apigateway.LambdaRestApi;
}

export class MonitoringStack extends cdk.Stack {
    loggingBucket: s3.Bucket;
    backendApiGateway: apigateway.LambdaRestApi;

    snsTopic: sns.Topic;

    canary: synthetics.Canary;
    canarySuccessMetric: cloudwatch.Metric;
    frontendRequestsMetric: cloudwatch.Metric;
    apiRequestsMetric: cloudwatch.Metric;
    availabilityAlarm: cloudwatch.Alarm;

    apiCanary: synthetics.Canary;
    apiCanarySuccessMetric: cloudwatch.Metric;
    apiGwCountMetric: cloudwatch.Metric;
    apiGw4xxErrorMetric: cloudwatch.Metric;
    apiGw5xxErrorMetric: cloudwatch.Metric;
    apiAvailabilityAlarm: cloudwatch.Alarm;

    dashboard: cloudwatch.Dashboard;

    constructor(scope: Construct, id: string, props: MonitoringStackProps) {
        super(scope, id, props);

        this.loggingBucket = props.loggingBucket;
        this.backendApiGateway = props.backendApiGateway;

        this.setupCanary();
        this.setupApiCanary();
        this.setupSnsTopic();
        this.setupMetrics();
        this.setupAvailabilityAlarms();
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
                bucket: this.loggingBucket,
                prefix: 'heartbeat-canary',
            },
            environmentVariables: {
                SNIPPETS_CLIENT_URL: process.env.SNIPPETS_CLIENT_URL || '',
                SNIPPETS_SEED_HASH: process.env.SNIPPETS_SEED_HASH || '',
                SNIPPETS_SEED_BODY: process.env.SNIPPETS_SEED_BODY || '',
            },
        });
    }

    setupApiCanary() {
        this.apiCanary = new synthetics.Canary(this, 'Synthetics-ApiCanary', {
            canaryName: 'api-heartbeat',
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
            schedule: synthetics.Schedule.rate(cdk.Duration.hours(1)),
            test: synthetics.Test.custom({
                code: synthetics.Code.fromAsset(path.join(__dirname, '../functions/heartbeat-canary-api')),
                handler: 'index.handler',
            }),
            artifactsBucketLocation: {
                bucket: this.loggingBucket,
                prefix: 'heartbeat-canary-api',
            },
            environmentVariables: {
                SNIPPETS_API_URL: this.backendApiGateway.url,
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

        this.apiCanarySuccessMetric = new cloudwatch.Metric({
            metricName: 'SuccessPercent',
            namespace: 'CloudWatchSynthetics',
            dimensionsMap: {
                CanaryName: 'api-heartbeat',
            },
            statistic: cloudwatch.Stats.AVERAGE,
            label: 'SuccessPercent',
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

    setupSnsTopic() {
        this.snsTopic = new sns.Topic(this, 'SNS-AlarmTopic', {
            topicName: 'CanaryAlarm',
        });
        const notificationEmail = process.env.SNS_NOTIFICATION_EMAIL || '';

        this.snsTopic.addSubscription(new snsSubscriptions.EmailSubscription(notificationEmail));
    }

    setupAvailabilityAlarms() {
        this.availabilityAlarm = new cloudwatch.Alarm(this, 'CW-AvailabilityAlarm', {
            alarmName: 'SnippetsFrontendAvailability',
            metric: this.canarySuccessMetric,
            threshold: 99,
            evaluationPeriods: 1,
            datapointsToAlarm: 1,
            comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });
        this.availabilityAlarm.addAlarmAction(new cloudwatchActions.SnsAction(this.snsTopic));

        this.apiAvailabilityAlarm = new cloudwatch.Alarm(this, 'CW-ApiAvailabilityAlarm', {
            alarmName: 'SnippetsApiAvailability',
            metric: this.apiCanarySuccessMetric,
            threshold: 99,
            evaluationPeriods: 1,
            datapointsToAlarm: 1,
            comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
            treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        });
        this.apiAvailabilityAlarm.addAlarmAction(new cloudwatchActions.SnsAction(this.snsTopic));
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
                title: 'ApiGatewayHeartBeatCanarySuccessPercentage',
                left: [this.apiCanarySuccessMetric],
                leftAnnotations: [this.apiAvailabilityAlarm.toAnnotation()],
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
