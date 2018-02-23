const fs = require('fs');
const path = require('path');
const db = require('..');

const modelsPath = __dirname;
const baseName = path.basename(__filename);

const models = fs.readdirSync(modelsPath)
    .filter(fileName => fileName !== baseName)
    .reduce((models, modelFile) => {
        const modelName = path.basename(modelFile, '.js');
        models[modelName] = db.import(path.join(modelsPath, modelFile));
        return models;
    }, {});

module.exports = models;
