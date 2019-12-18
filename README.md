# Kanbanbot

### Required Docker Secrets
- github_personal_access_token      // Pesonal access token from github
- slack_access_token                // OAuth Access Token from Slack

**Note**: The secret `github_personal_access_token` may be supplied with the env `GH_TOKEN`. (Unsecure)
**Note**: The secret `slack_access_token` may be supplied with the env `SLACK_ACCESS_TOKEN`. (Unsecure)

### Environment Variables
- DB_HOST                   // Database host
- DB_NAME                   // Database name 
- DB_USER                   // Database user
- DB_PASS                   // Database password
- DB_POOL_MAX               // Maximum of concurrent connections to the database
- GH_ORG                    // Github organisation
- DEFAULT_SLACK_CHANNEL     // The default **ID**(e.g. ABCDE1234) of the slack channel 

### Webhook Urls
- /slack/command            // Create command and set at https://api.slack.com/apps/XXXXXX/slash-commands
- /slack/action             // Set at https://api.slack.com/apps/XXXXXX/interactive-messages
- /github/webhook           // Set in githun org. settings