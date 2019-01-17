const fs = require('fs');
const path = require('path');
const db = require('..');

const modelsPath = __dirname;
const baseName = path.basename(__filename);

const models = fs.readdirSync(modelsPath)
    .filter(fileName => fileName !== baseName)
    .reduce((modelsMap, modelFile) => {
        const modelName = path.basename(modelFile, '.js');
        modelsMap[modelName] = db.import(path.join(modelsPath, modelFile));
        return modelsMap;
    }, {});

module.exports = models;
