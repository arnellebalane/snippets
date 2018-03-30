const {json, render, status} = require('server/reply');
const {Snippet} = require('../database/models');

async function createSnippet(ctx) {
    const snippet = await Snippet.create({body: ctx.data.snippet});
    return json(snippet.get());
}

async function getSnippet(ctx) {
    if (ctx.headers.accept === 'application/json') {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({where: {hash}});

        return snippet
            ? json(snippet.get())
            : status(404).send('Snippet not found.');
    }

    return render('index.html');
}

async function getRawSnippet(ctx) {
    const hash = ctx.params.hash;
    const snippet = await Snippet.findOne({where: {hash}});

    return snippet
        ? render('raw.html', {snippet: snippet.get()})
        : status(404).send('Snippet not found.');
}

exports.create = createSnippet;
exports.get = getSnippet;
exports.raw = getRawSnippet;
