const {render} = require('server/reply');

async function home() {
    return render('index.html');
}

module.exports = home;
