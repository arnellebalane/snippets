module.exports = (database, DataTypes) => {
    return database.define('snippet', {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        body: DataTypes.TEXT
    });
};
