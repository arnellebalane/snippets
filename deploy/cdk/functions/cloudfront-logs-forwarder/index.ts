import { promisify } from 'node:util';
import { unzip as _unzip } from 'node:zlib';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { Handler, S3Event } from 'aws-lambda';
import { omit } from 'lodash';

type CloudFrontAccessLog = Record<string, string> & { _timestamp: number };

const s3 = new S3Client({});
const logs = new CloudWatchLogsClient({});
const unzip = promisify(_unzip);

const logGroupName = process.env.CLOUDWATCH_LOG_GROUP_NAME || '';
const logEventsPerBatch = 10_000;

const createLogStream = async (logStreamName: string) => {
    const request = new CreateLogStreamCommand({
        logGroupName,
        logStreamName,
    });

    await logs.send(request);
    console.info(`Log stream "${logStreamName}" in log group "${logGroupName}" was successfully created.`);
};

const parseCloudFrontLogs = (content: string): CloudFrontAccessLog[] => {
    const lines = content.trim().split(/\r?\n/g);
    const fields = lines[1].replace('#Fields: ', '').split(/\s+/g);

    return lines.slice(2).map((line) => {
        const values = line.split(/\t/g);
        const log = fields.reduce((result, field, i) => {
            result[field] = values[i];
            return result;
        }, {} as CloudFrontAccessLog);
        log._timestamp = new Date(`${log.date}T${log.time}+00:00`).valueOf();
        return log;
    });
};

const sendLogsToCloudWatch = async (logEvents: CloudFrontAccessLog[], logStreamName: string) => {
    const batches = Math.ceil(logEvents.length / logEventsPerBatch);

    for (let batch = 0; batch < batches; batch++) {
        const start = batch * logEventsPerBatch;
        const end = start + logEventsPerBatch;

        const request = new PutLogEventsCommand({
            logGroupName,
            logStreamName,
            logEvents: logEvents
                .slice(start, end)
                .map((logEvents) => ({
                    timestamp: logEvents._timestamp,
                    message: JSON.stringify(omit(logEvents, ['_timestamp'])),
                }))
                .sort((a, b) => a.timestamp - b.timestamp),
        });

        await logs.send(request);
        console.info(
            `Log events for log stream "${logStreamName}" in log group "${logGroupName}" were successfullly sent to CloudWatch.`
        );
    }
};

export const handler: Handler = async (event: S3Event, context) => {
    for (const record of event.Records) {
        const Bucket = record.s3.bucket.name;
        const Key = record.s3.object.key;

        const request = new GetObjectCommand({ Bucket, Key });
        const response = await s3.send(request);
        if (!response.Body) {
            console.error(`Object "${Key}" from bucket "${Bucket}" is empty.`);
            return;
        }

        let content;
        if (response.ContentType === 'application/x-gzip' || Key.endsWith('.gz')) {
            const buffer = await response.Body.transformToByteArray();
            content = (await unzip(buffer)).toString('utf8');
        } else {
            content = await response.Body.transformToString();
        }

        const logs = parseCloudFrontLogs(content);
        await createLogStream(Key);
        await sendLogsToCloudWatch(logs, Key);
    }
};
