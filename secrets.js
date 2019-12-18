/**
 * Load Docker Swarm Secrets from disk.
 * Env. variables are used as fallback.
 */

const fs = require("fs");

module.exports = {
    githubToken: getSecret("github_personal_access_token", "GH_TOKEN"),
    slackToken: getSecret("slack_access_token", "SLACK_ACCESS_TOKEN")
}

function getSecret(key, envKey) {
    try {
        return fs.readFileSync(`/var/run/secrets/${key}`).toString();
    } catch{
        return envKey ? process.env[envKey] : null;
    }
}