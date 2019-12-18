const Column = require("../models").Column;

module.exports = {
    set: ({ projectId, ghId, name, limit, count }) => Column.upsert({ projectId, ghId, name, limit, count }),
    update: (ghId, data) => Column.update(data, { where: { ghId } }),
    get: projectId => Column.findAll({ where: { projectId } }),
    delete: projectId => Column.destroy({ where: { projectId } })
}