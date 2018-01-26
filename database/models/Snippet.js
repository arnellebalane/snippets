const crypto = require('crypto');

module.exports = (database, DataTypes) => {
    const Snippet = database.define('snippet', {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        body: DataTypes.TEXT
    }, {
        hooks: {
            async beforeValidate(instance, options) {
                let body = instance.body + Date.now();
                let hash = crypto.createHash('sha256')
                    .update(body)
                    .digest('base64')
                    .substring(0, 5);
                let existing = await Snippet.findOne({ where: { hash } });

                while (existing) {
                    body = instance.body + Date.now();
                    hash = crypto.createHash('sha256')
                        .update(body)
                        .digest('base64')
                        .substring(0, 5);
                    existing = await Snippet.findOne({ where: { hash } });
                }

                instance.hash = hash;
            }
        }
    });

    return Snippet;
};
