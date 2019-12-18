const Koa = require('koa');
const koaBody = require('koa-body');
const commands = require("./commands");
const actions = require("./actions");
const dialogs = require("./dialogs");
const CommandError = require("./CommandError");
const github = require("./github");

const app = new Koa();

// Parse request body as json
app.use(koaBody({
    jsonLimit: '5kb'
}));

// Handle all requests
app.use(async function (ctx) {
    const { path, body } = ctx.request;

    // Route request to correct handler.
    let handler;
    switch (path) {
        case "/slack/command":
            handler = onCommand(ctx, body);
            break;
        case "/slack/action":
            handler = onInteractiveMessage(ctx, body.payload);
            break;
        case "/github/webhook":
            handler = onGitHubWebhook(ctx, body);
            break;
        default:
            ctx.status = 404;
            return;
    }

    // Generic Handle
    return handler
        .catch(error => {
            console.error(error);
            ctx.status = 500;
            ctx.body = "Internal Server Error";
        });
});

function onGitHubWebhook(ctx, payload) {
    return github.handleGithubWebhook(payload);
}

// For Actions (e.g. slack button click)
function onInteractiveMessage(ctx, _payload) {
    const payload = JSON.parse(_payload);

    const _actions = payload.actions;

    switch (payload.type) {
        case "interactive_message": {
            return Promise.all(
                _actions.map(a => actions(ctx, payload, a))
            ).then(results =>
                mergeResponses(results)
            ).then(response => {
                ctx.status = 200;
                ctx.body = response;
            });
        }
        case "dialog_submission": {
            return dialogs(ctx, payload).then(response => {
                ctx.status = 200;
                ctx.body = response;
            });
        }
        default: {
            ctx.status = 404;
            return;
        }

    }
}

// For commands (e.g. slack slash command)
function onCommand(ctx, body) {
    return commands(ctx, body)
        .then(response => {
            ctx.status = 200;
            ctx.body = response;
        }).catch(error => {
            if (error instanceof CommandError) {
                ctx.status = 200;
                ctx.body = `Error: ${error.message}`;
            } else {
                throw error;
            }
        });
}

// Start listening
app.listen(80);

/**
 * This functions merges the contents of multiple
 * objects into one object. Duplicate keys will
 * not be preserved.
 * 
 * @param {object} responses 
 */
function mergeResponses(responses) {
    let obj = Object.create(null);
    responses.forEach(element => {
        obj = { ...obj, ...element };
    });
    return obj;
}