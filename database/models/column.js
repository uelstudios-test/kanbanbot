const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const Column = sequelize.define(
    "columns",
    {
        // id is added automatically, because the primaryKey is not overriden
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: "unique_column_per_project"
        },
        ghId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        limit: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }
);

module.exports = Column;
