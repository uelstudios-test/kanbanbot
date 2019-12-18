const deleteProject = require("./deleteProject");
const setColumnLimits = require("./setColumnLimits");

module.exports = (ctx, payload, action) => {
    switch (action.name) {
        case "delete-project":
            return deleteProject(ctx, payload, action.value);
        case "set-limits-project":
            return setColumnLimits(ctx, payload, action.value);
        default:
            throw new Error(`Action ${action.name} does not exist`)
    }
}