const { Op } = require("sequelize");
const sequelize = require("../sequelize");
const Sequelize = require("sequelize");
const Column = require("../models").Column;

module.exports = {
    set: (projectId, columnName, limit, count) => Column.upsert({ projectId, name: columnName, limit, count }),
    get: projectId => Column.findAll({ where: { projectId } }),
    delete: projectId => Column.destroy({ where: { projectId } })
}