[![CodeQL](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/codeql.yml/badge.svg)](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/codeql.yml)
[![Dependency Review](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/dependency-review.yml)

# HOPELESS BOT

**Hopeless Bot** is a multipurpose discord Bot. Specially made for _Moderation_ & _Server-Management_. It was made with [discord.js](https://github.com/discordjs/discord.js) a powerful [**Node.js**](https://nodejs.org/en/) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

## Road Map

-   [x] **Basic Bot**
-   [x] **Advance Bot**
-   [ ] **Moderation Bot**
-   [ ] **Music Bot**
-   [ ] **Web based Dashboard**
-   [ ] **Website**

## Features

1. Includes an advance command and Event Handler.
1. Includes advance commands
1. Includes error logging system.

## Get Started

1. Copy `.env.example` to `.env` and fill in the values as detailed below.
1. Create a [MongoDB](https://www.mongodb.com/) database and fill in `MONGO_URL`.
1. Create a Discord application at https://discord.com/developers/applications.
1. Go to the Bot tab.
    - Click "Reset Token" and fill in `DISCORD_TOKEN`.
    - Disable "Public Bot" unless you want your bot to be visible to everyone.
    - Enable "Server Members Intent", "Presence Intent" and "Message Content Intent" under "Privileged Gateway Intents".
1. Go to the Oauth2 tab, copy your "Client ID", and fill in `CLIENT_ID`.
1. Fill in `OWNER_ID`as your discord userId, `SERVER_ID` as test server.
1. Fill in `DEVELOPER_ID` for devs.
1. Install dependencies and run the bot.
    ```
    npm install
    npm start
    ```
1. Now go to Install tab
    - In Installation Contexts select `Guild Install` & scroll down to Default Install Settings.
    - For `SCOPES` select `applications.commands` & `bot`, for `PERMISSIONS` select `Administrator` permission.
    - Above in `Install Link` select discord provided link and copy the link.
    - Use the copied link to invite the bot to your server.
1. Start using the bot. Use `/ping` or `/botinfo` command for test.

## Customization

[`src/config.js`](https://github.com/theassassin0128/Hopeless-Bot/tree/main/src/config.js) is a config module dedicated for bot config and other stuff. Change the values according to your need.

> **Note** : use hex color code for the colors. (example: #FF0000)

## TOOLS

1. [`tools/clearCommands.js`](https://github.com/theassassin0128/Hopeless-Bot/tree/main/tools/clearCommands.js) is a tool which can clear application commands both global and guild based ones.

    ```bash
    # you can run the module like this ⬇️. This will clear every slash command of the bot.
    node tools/clearCommands.js
    ```

    It can also be used as a function as it can be called like this ⬇️

    ```js
    const { clearCommands } = require("./tools/clearCommands.js");

    clearCommands();
    ```

## Commands

| Name       | description                                              |
| ---------- | -------------------------------------------------------- |
| botinfo    | View bot's stats in an embed message                     |
| invite     | Get a link button with embeded invite-link.              |
| roleinfo   | Similar to botinfo view information of a server role     |
| roles      | Get an embed message with full list of roles (UpTo 150)  |
| serverinfo | Same as roleinfo view information about a discord server |
| userinfo   | Same as serverinfo view information of a discord user    |

Written above are some public & utility commands of the bot.
