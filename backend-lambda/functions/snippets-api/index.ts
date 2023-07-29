import { APIGatewayProxyEventV2, Handler } from 'aws-lambda';
import { createSnippet } from './utils';

export const handler: Handler = async (event: APIGatewayProxyEventV2, context) => {
    if (event.requestContext.http.method === 'POST') {
        const payload = JSON.parse(event.body);
        await createSnippet(payload.snippet);
    }
};
