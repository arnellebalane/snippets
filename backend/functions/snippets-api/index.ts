import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import createApi, { Request } from 'lambda-api';
import { createSnippet, readSnippet } from './snippets';

const api = createApi({ base: '/api/snippets' });

api.post('/', async (request: Request) => {
    const snippet = await createSnippet(request.body.snippet);
    return snippet;
});

api.get('/:hash', async (request: Request) => {
    const snippet = await readSnippet(request.params.hash);
    return snippet;
});

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    return await api.run(event, context);
};
