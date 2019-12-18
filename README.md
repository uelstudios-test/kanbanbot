# Kanbanbot
A Slackbot that notifies you, if your project management on github goes out of hand.

## How to use
1. Create and configure GitHub & Slack App 
2. Set docker secrets with `docker secret create`
3. Set environment variables in `docker-compose.yml`
4. Run with `docker stack deploy -c docker-compose.yml Kanbanbot`

### Slack App Setup
- required permissions: `channels:read`, `chat:write:bot`, `commands`, `files:write:user`, `incoming-webhook`
- enable Slash Commands
- enable Interactive Components

### Required Docker Secrets
```
- github_personal_access_token      // Pesonal access token from GitHub
- slack_access_token                // OAuth Access Token from Slack
```

**Note**: The secret `github_personal_access_token` may be supplied with the env `GH_TOKEN`. (Unsecure)
**Note**: The secret `slack_access_token` may be supplied with the env `SLACK_ACCESS_TOKEN`. (Unsecure)

### Environment Variables
```
- DB_HOST                   // Database host
- DB_NAME                   // Database name 
- DB_USER                   // Database user
- DB_PASS                   // Database password
- DB_POOL_MAX               // Maximum of concurrent connections to the database
- GH_ORG                    // Github organisation
- DEFAULT_SLACK_CHANNEL     // The default **ID**(e.g. ABCDE1234) of the slack channel 
- NO_EMOJI                  // Prevents the app from changing column titles
```
### Webhook Urls
```
- /slack/command            // Create command and set at https://api.slack.com/apps/XXXXXX/slash-commands
- /slack/action             // Set at https://api.slack.com/apps/XXXXXX/interactive-messages
- /github/webhook           // Set in githun org. settings
```

### Limitations
- Only GitHub Organisations are supported.
- 

## Author
Paul von Allwörden