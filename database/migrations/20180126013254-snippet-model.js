exports.up = (database, DataTypes) => {
    return database.createTable('snippets', {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        body: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
};

exports.down = (database, DataTypes) => {
    return database.dropTable('snippets');
};
