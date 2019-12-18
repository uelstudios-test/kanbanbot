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

    return github.projectFromUrl(args[0]).then(project => {
        return db.project.add(args[0], project.id).then(() => `Das Projekt ${project.name} wurde hinzugefügt!`);
    }).catch((e) => { console.log(e); throw new CommandError("Das Projekt wurde nicht gefunden!"); })
}