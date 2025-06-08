import express from 'express';
import { createSnippet, readSnippet } from '../core/snippets';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post('/api/snippets', async (req, res) => {
    const snippet = await createSnippet(req.body.snippet);
    res.json(snippet);
});

app.get('/api/snippets/:hash', async (req, res) => {
    const snippet = await readSnippet(req.params.hash);
    res.send(snippet);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
