const Project = require("./project");
const Column = require("./column");
const sequelize = require("../sequelize");

Column.belongsTo(Project, { foreignKey: { unique: "unique_column_per_project" } });
Project.hasMany(Column);

sequelize.sync();

module.exports = {
    Project,
    Column
}