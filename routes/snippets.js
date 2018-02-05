const { json, render, send, status } = require('server/reply');
const { Snippet } = require('../database/models');
const renderer = require('./_renderer');

async function createSnippet(ctx) {
    const snippet = await Snippet.create({ body: ctx.data.snippet });
    return json(snippet.get());
}

async function getSnippet(ctx) {
    if (ctx.headers.accept === 'application/json') {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({ where: { hash } });

        return snippet
            ? json(snippet.get())
            : status(404).send('Snippet not found.');
    }

    try {
        const response = await renderer.renderToString({ url: ctx.url });
        return send(response);
    } catch (err) {
        const context = {
            code: 500,
            message: 'Something went wrong on our side'
        };
        if (err.response.status === 404) {
            context.code = 404;
            context.message = 'Snippet not found';
        }
        return render('error.html', context);
    }
}

async function getRawSnippet(ctx) {
    const hash = ctx.params.hash;
    const snippet = await Snippet.findOne({ where: { hash } });

    return snippet
        ? render('raw.html', { snippet: snippet.get() })
        : status(404).send('Snippet not found.');
}

exports.create = createSnippet;
exports.get = getSnippet;
exports.raw = getRawSnippet;
