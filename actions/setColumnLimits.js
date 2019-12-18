const axios = require("axios").default;
const { project, column } = require("../database");
const secrets = require("../secrets");

module.exports = async (ctx, payload, value) => {
    return getColumnUiElements(value)
        .then(elements => axios.post("https://api.slack.com/api/dialog.open",
            {
                trigger_id: payload.trigger_id,
                dialog: {
                    callback_id: "set-column-limits",
                    title: "Spaltenlimits",
                    submit_label: "Setzen",
                    notify_on_cancel: false,
                    state: { projectId: value },
                    elements
                }
            },
            {
                headers:
                {
                    "Authorization": "Bearer " + secrets.slackToken
                }
            }
        )
            .then(() => ({ text: "" })));
}

async function getColumnUiElements(projectId) {
    const dbColumns = await column.get(projectId);

    const elements = [];
    dbColumns.forEach(col => {
        elements.push({
            type: "text",
            label: col.name,
            name: col.ghId,
            value: col.limit === null ? "Kein Limit" : col.limit,
            optional: true
        });
    });

    const dbproj = await project.get(projectId);
    elements.push({
        "label": "Slack Channel",
        "type": "select",
        "name": "slackchannel",
        "options": await getChannels(),
        value: dbproj.slackChannel || process.env.DEFAULT_SLACK_CHANNEL
    });

    return elements;
}

function getChannels() {
    return axios.post("https://slack.com/api/channels.list", {},
        {
            headers: {
                "Authorization": "Bearer " + secrets.slackToken
            }
        }
    ).then(d => d.data.channels)
        .then(channels => channels.map(c => ({
            label: c.name,
            value: c.id
        })));
}