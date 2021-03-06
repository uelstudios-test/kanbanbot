const CommandError = require("../CommandError");
const { project } = require("../database");
const github = require("../github");

module.exports = (ctx, args) => {
    if (args.length !== 0) {
        throw new CommandError(`list-project expects no parameter(s). Got ${args.length}`);
    }

    return project
        .list()
        .then(async (projects) => projects.length > 0 ?
            ({ attachments: await projectsToList(projects) }) :
            { text: "Keine Projekte verfügbar" }
        );
}

/**
 * Returns all projects as slack compatible message. 
 * 
 * @param {GitHub Projects} projects 
 */
async function projectsToList(projects) {
    // Get all names
    const names = await Promise.all(projects.map((p) => github.projectFromUrl(p.url).then(p => p.name)));

    return projects
        .map((p, i) => ({
            callback_id: "123",
            text: `#${i + 1} ${names[i]}\t`,
            "actions": [
                {
                    name: "set-limits-project",
                    text: "Limits",
                    type: "button",
                    value: p.id
                },
                {
                    name: "delete-project",
                    text: "Löschen",
                    type: "button",
                    value: p.id,
                    style: "danger",
                    confirm: {
                        title: `Unwiderruflich löschen?`,
                        text: `Möchtest du das Projekt ${names[i]} wirklich löschen?`,
                        ok_text: "Löschen",
                        dismiss_text: "Abbrechen"
                    }
                }
            ]
        }
        ));
}