import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import express from 'express';

import { createSnippet, readSnippet } from '../core/snippets';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post('/api/snippets', async (req, res) => {
    try {
        const snippet = await createSnippet(req.body.snippet);
        res.json(snippet);
    } catch {
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.get('/api/snippets/:hash', async (req, res) => {
    try {
        const snippet = await readSnippet(req.params.hash);
        res.send(snippet);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            res.status(404).send({ message: 'Snippet not found' });
        } else {
            res.status(500).send({ message: 'Internal server error' });
        }
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
