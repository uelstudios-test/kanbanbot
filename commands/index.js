const CommandError = require("../CommandError");
const addProject = require("./addProject");
const listProjects = require("./listProjects");
const showStats = require("./showStats");

/**
 * The data of /command goes here.
 */
module.exports = async (ctx, body) => {
    const { text } = body;
    const { command, args } = parseCommandFromText(text);

    switch (command) {
        case "add-project":
            return addProject(ctx, args);
        case "list-projects":
            return listProjects(ctx, args);
        case "show-stats":
            return showStats(ctx, args);
        default:
            throw new CommandError(`Command ${command} not available`)
    }
}

/**
 * Parse: do abc 123 -> command:"do", args: ["abc","123"]
 */
function parseCommandFromText(text) {
    const parts = text.split(" ");

    return {
        command: parts[0],
        args: parts.slice(1, parts.length)
    };
}