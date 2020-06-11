# How to run me:
1. Clone repo
2. Download the .env file from the Google Drive folder: 'Furlough Hackathon 2020' and place it into this project
3. If this is your first time running the project, open an intergrated terminal and run the command: 'npm install'
4. Open an intergrated terminal and enter the command: 'npm start'
5. Run serveo and get your localhost linked to a public domain by entering the command: 'ssh -R team-awesome:80:localhost:3000 serveo.net' or 'ssh -R localhost:80:localhost:3000 and-reginald@ssh.localhost.run' (recommended)
6. Log into Slack, Team-Awesome workspace, and starting talking to Reginald in the Apps section!

# Slack Events and Commands configuration update
To run Slack integration with your local setup, configure your Slack App as follows:
1. Change the Event Subscriptions > Request URL to the one supplioed by Serveo or Localhost.run e.g. https://and-reginald-e6852d81.localhost.run/slack/events (hit the Save button)
2. Edit all commands' Request URL in Slash Commands to the path supplied by Serveo or Localhost.run e.g. https://and-reginald-e6852d81.localhost.run/slack/events (hit the Save button)
3. Re-install the App in Basic Information > Install your app to your workspace and hit the Reinstall App button
