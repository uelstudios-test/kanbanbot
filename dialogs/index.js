const setColumnLimits = require("./setColumnLimits");

/**
 * The response of a dialog goes here.
 */
module.exports = (ctx, payload) => {
    switch (payload.callback_id) {
        case "set-column-limits":
            return setColumnLimits(ctx, payload);
        default:
            throw new Error(`Dialog submission ${payload.callback_id} does not exist`)
    }
}