const crypto = require('crypto');

function generateHash(data) {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('ascii')
    .replace(/[^\w\d]/g, '')
    .substring(0, 5);
}

module.exports = (database, DataTypes) => {
  const Snippet = database.define(
    'snippet',
    {
      hash: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      body: DataTypes.TEXT
    },
    {
      hooks: {
        async beforeValidate(instance) {
          let body = instance.body + Date.now();
          let hash = generateHash(body);
          let existing = await Snippet.findOne({ where: { hash } });

          while (existing) {
            body = instance.body + Date.now();
            hash = generateHash(body);
            existing = await Snippet.findOne({ where: { hash } });
          }

          instance.hash = hash;
        }
      }
    }
  );

  return Snippet;
};
