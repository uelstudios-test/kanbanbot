const Koa = require('koa');
const Router = require('@koa/router');
const koaBody = require('koa-body');
const commands = require("./commands");
const actions = require("./actions");
const dialogs = require("./dialogs");
const CommandError = require("./CommandError");
const github = require("./github");

const app = new Koa();
const router = new Router();

// Parse request body as json
app.use(koaBody({
    jsonLimit: '5kb'
}));

// Handle all requests
router.post("/slack/command", (ctx) => {
    const { body } = ctx.request;

    return onCommand(ctx, body)
        .catch(error => {
            console.error(error);
            ctx.status = 500;
            ctx.body = "Internal Server Error";
        });
});

router.post("/slack/action", (ctx) => {
    const { body } = ctx.request;

    return onInteractiveMessage(ctx, body)
        .catch(error => {
            console.error(error);
            ctx.status = 500;
            ctx.body = "Internal Server Error";
        });
})

router.post("/github/webhook", (ctx) => {
    const { body } = ctx.request;

    return onGitHubWebhook(ctx, body)
        .catch(error => {
            console.error(error);
            ctx.status = 500;
            ctx.body = "Internal Server Error";
        });
})

app.use(router.routes());
app.use(router.allowedMethods());


/**
 * 
 * 
 * 
 */


function onGitHubWebhook(ctx, payload) {
    return github.handleGithubWebhook(payload);
}

// For Actions (e.g. slack button click)
function onInteractiveMessage(ctx, _payload) {
    const payload = JSON.parse(_payload.payload);
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
            return Promise.reject();
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