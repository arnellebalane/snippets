import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import createApi, { Request } from 'lambda-api';
import { createSnippet, readSnippet } from './snippets';

const api = createApi();

api.post('/snippets', async (request: Request) => {
    const snippet = await createSnippet(request.body.snippet);
    return snippet;
});

api.get('/snippets/:hash', async (request: Request) => {
    const snippet = await readSnippet(request.params.hash);
    return snippet;
});

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    return await api.run(event, context);
};
