# How to run me:
1. Clone repo
2. Download the .env file from the Google Drive folder: 'Furlough Hackathon 2020' and place it into this project
3. If this is your first time running the project, open an intergrated terminal and run the command: 'npm install'
4. Open an intergrated terminal and enter the command: 'npm start'
5. Run serveo and get your localhost linked to a public domain by entering the command: 'ssh -R team-awesome:80:localhost:3000 serveo.net'
6. Log into Slack, Team-Awesome workspace, and starting talking to Reginald in the Apps section!

# Alternate to serveo: ngrok
1. Follow these steps to install ngrok: https://ngrok.com/download
2. Run ngrok to obtain the dynamic address: 'ngrok http 3000'
3. Setup slack Events and Commands with the URL and re-install the reginald app in Slack
