const Project = require("../models").Project;

module.exports = {
    add: (url, ghId) => {
        return Project.create({ url, ghId });
    },
    get: id => {
        return Project.findOne({ where: { id } })
    },
    getByUrl: url => {
        return Project.findOne({ where: { url } })
    },
    getByghId: ghId => {
        return Project.findOne({ where: { ghId } })
    },
    setChannel: (id, channel) => {
        return Project.update({ slackChannel: channel }, { where: { id } })
    },
    list: () => {
        return Project.findAll();
    },
    delete: id => {
        return Project.destroy({ where: { id } })
    }
}