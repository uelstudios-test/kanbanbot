const CommandError = require("../CommandError");
const { isValidUrl } = require("../utils")
const { project } = require("../database");
const github = require("../github");

module.exports = (ctx, args) => {
    if (args.length !== 0) {
        throw new CommandError(`list-project expects no parameter(s). Got ${args.length}`);
    }

    return project
        .list()
        .then(async (projects) =>
            ({
                attachments: await projectsToList(projects)
            })
        );
}

/**
 * #1  url
 * #2  url
 * ...
 * #n  url
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