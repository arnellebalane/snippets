const { render } = require('server/reply');

async function home(ctx) {
    return render('index.html');
}

module.exports = home;
