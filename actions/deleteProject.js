const axios = require("axios").default;
const { project } = require("../database");

module.exports = (ctx, payload, value) => {
    return project
        .delete(value)
        .then(() => axios.post(payload.response_url, { text: "Das Projekt wurde gelöscht!" }))
        .then(() => ({ text: "" }));
}