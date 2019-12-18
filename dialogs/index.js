const setColumnLimits = require("./setColumnLimits");

module.exports = (ctx, payload) => {
    switch (payload.callback_id) {
        case "set-column-limits":
            return setColumnLimits(ctx, payload);
        default:
            throw new Error(`Dialog submission ${payload.callback_id} does not exist`)
    }
}