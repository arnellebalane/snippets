import middy from '@middy/core';
import secretsManager from '@middy/secrets-manager';
import { APIGatewayProxyEventV2, Handler } from 'aws-lambda';
import { createSnippet } from './utils';

export const handler: Handler = middy(async (event: APIGatewayProxyEventV2, context) => {
    if (event.requestContext.http.method === 'POST') {
        const payload = JSON.parse(event.body);
        await createSnippet(payload.snippet);
    }
}).use(
    secretsManager({
        fetchData: {
            DATABASE_URL: process.env.DATABASE_URL_SECRET_ARN,
        },
        setToContext: true,
    })
);
