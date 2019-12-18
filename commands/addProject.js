const CommandError = require("../CommandError");
const { isValidUrl } = require("../utils")
const db = require("../database");
const github = require("../github");

// args: ["string: URL"]
module.exports = (ctx, args) => {
    if (args.length !== 1) {
        throw new CommandError(`add-project expects exactly one parameter (url). Got ${args.length}`);
    }

    if (!isValidUrl(args[0])) {
        throw new CommandError(`${args[0]} is not a valid url`);
    }

    return github.projectFromUrl(args[0])
        .then(project => db.project.add(args[0], project.id)
            .then(() => db.project.getByUrl(args[0])
                .then(dbproj => github.octokit.projects.listColumns({ project_id: project.id })
                    .then(response => response.data)
                    .then(columns => {
                        let dbInserts = [];

                        for (let i = 0; i < columns.length; i++) {
                            const col = columns[i];
                            dbInserts.push(
                                db.column.set({ projectId: dbproj.id, ghId: col.id, limit: 10, count: 10, name: col.name })
                            );
                        }

                        return Promise.all(dbInserts);
                    }))
                .then(() => `Das Projekt ${project.name} wurde hinzugefügt!`)))
        .catch((e) => { console.log(e); throw new CommandError("Das Projekt wurde nicht gefunden!"); })
}