const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const Project = sequelize.define(
    "projects",
    {
        // id is added automatically, because the primaryKey is not overriden
        url: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // GitHub ID
        ghId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // Slack Channel to post notifications in
        slackChannel: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }
);

module.exports = Project;
