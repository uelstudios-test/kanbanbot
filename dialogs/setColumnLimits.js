const axios = require("axios").default;
const { project, column } = require("../database");

module.exports = async (ctx, payload) => {
    const { submission: newLimits, state: projectId } = payload;

    const columnKeys = Object.keys(newLimits);

    for (let i = 0; i < columnKeys.length; i++) {
        const key = columnKeys[i];

        if (key === "slackchannel") {
            await project.setChannel(projectId, newLimits[key] || process.env.DEFAULT_SLACK_CHANNEL);
            continue;
        }

        const newLimit = newLimits[key];
        const parsed = Number.parseInt(newLimit);

        if (newLimit !== null && !isNaN(parsed)) {
            await column.set(projectId, key, parsed, undefined);
        } else {
            await column.set(projectId, key, -1, undefined);      // TODO: -1 should be null (change column model to support it)
        }
    }

    return axios.post(payload.response_url,
        {
            text: "Die neuen Limits wurden gesetzt!"
        }
    ).then(() => Promise.resolve());
}