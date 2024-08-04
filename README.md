[![CodeQL](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/codeql.yml/badge.svg)](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/codeql.yml)
[![Dependency Review](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/dependency-review.yml)

# HOPELESS BOT

**Hopeless Bot** is a multipurpose discord Bot. Specially made for _Moderation_ & _Server-Management_. It was made with [discord.js](https://github.com/discordjs/discord.js) a powerful [**Node.js**](https://nodejs.org/en/) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

## Road Map

-   [x] **Basic Bot**
-   [ ] **Moderation Bot**
-   [ ] **Chat Bot**
-   [ ] **Web based Dashboard**
-   [ ] **Website**

## Features

## Get Started

1. Copy `.env.example` to `.env` and fill in the values as detailed below.
1. Create a [MongoDB](https://www.mongodb.com/) database and fill in `MONGO_URL`.
1. Create a Discord application at https://discord.com/developers/applications.
1. Go to the Bot tab and click "Add Bot"
    - Click "Reset Token" and fill in `DISCORD_TOKEN`
    - Disable "Public Bot" unless you want your bot to be visible to everyone
    - Enable "Server Members Intent", "Presence Intent" and "Message Content Intent" under "Privileged Gateway Intents"
1. Go to the OAuth2 tab (General), copy your "Client ID", and fill in `CLIENT_ID`.
1. Copy your discord account id and fill in `OWNER_ID`.
1. Copy your discord server id and fill in `SERVER_ID`.
1. Install dependencies and run the bot
    ```
    npm install
    npm start
    ```
1. Now go to URL generator tab, in scopes select "bot", "application.commands" scroll down select "Administrator" permission copy the url and invite the bot to your server.
1. Start using the bot. Use `/ping` or `/botinfo` commands.

## Customization

[`src/config.js`](https://github.com/theassassin0128/Hopeless-Bot/tree/main/src/config.js) is a config module dedicated for bots config and other stuff. Change the values there according to your need.

> **Note** : use hex colour code for the colors. (example: #FF0000 or "RED")

## Commands

| Name       | description                                              |
| ---------- | -------------------------------------------------------- |
| botinfo    | View bot's stats in an embed message                     |
| invite     | Get a link button with embeded invite-link.              |
| roleinfo   | Similar to botinfo view information of a server role     |
| roles      | Get an embed message with full list of roles (UpTo 150)  |
| serverinfo | Same as roleinfo view information about a discord server |
| memberinfo | Same as serverinfo view information of a server member   |

Written above are some public & utility commands of the bot.
