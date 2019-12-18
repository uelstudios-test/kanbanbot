const Octokit = require("@octokit/rest");
const axios = require("axios").default;
const secrets = require("../secrets");
const db = require("../database");
const message = require("../message");

const octokit = new Octokit({
    auth: secrets.githubToken
})

module.exports = {
    octokit,
    projectFromUrl,
    handleGithubWebhook: async (payload) => {
        const project = await projectFromUrl(payload.project_card.project_url);

        let dbProject;
        try {
            dbProject = await db.project.getByghId(project.id);
            if (dbProject === null) throw new Error("project does not exist");
        } catch (e) { return Promise.resolve() }

        const columns = (await octokit.projects.listColumns({ project_id: project.id })).data;
        const columnLimits = await db.column.get(dbProject.id);

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const cards = (await octokit.projects.listCards({ column_id: column.id })).data;
            const colLim = columnLimits.find(el => el.name === column.name);

            if (!colLim) continue;
            if (colLim.limit <= 0) continue;

            if (colLim.limit < cards.length && colLim.count <= colLim.limit) {
                // Send the slack message
                await sendSlackMessage(dbProject.slackChannel || process.env.DEFAULT_SLACK_CHANNEL,
                    message.too_many_cards
                        .replace("%column%", column.name)
                        .replace("%project%", project.name)
                        .replace("%project_href%", project.html_url)
                );
            }

            // Update the count
            await db.column.set(dbProject.id, colLim.name, undefined, cards.length);
        }

        return "";
    }
}

function projectFromUrl(url) {
    return octokit.projects.listForOrg({
        org: process.env.GH_ORG
    })
        .then(response => response.data)
        .then(projects => {
            for (let i = 0; i < projects.length; i++) {
                const element = projects[i];
                if (element.url === url || element.html_url === url) return element;
            }
            return null;
        }).then(project => {
            if (project) {
                return project;
            } else {
                throw new Error("Project not found!");
            }
        })
}

function sendSlackMessage(channel, message) {
    return axios.post("https://api.slack.com/api/chat.postMessage",
        {
            channel,
            text: message
        },
        {
            headers:
            {
                "Authorization": "Bearer " + secrets.slackToken
            }
        }
    );
}