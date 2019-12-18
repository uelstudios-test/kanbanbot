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
            await column.update(key, { limit: parsed });
        } else {
            await column.update(key, { limit: null });
        }
    }

    return axios.post(payload.response_url,
        {
            text: "Die neuen Limits wurden gesetzt!"
        }
    ).then(() => Promise.resolve());
}