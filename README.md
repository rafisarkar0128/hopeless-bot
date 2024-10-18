> [!IMPORTANT]
> This is **_rebuild_** branch. Its more like the new base for rebuilding the bot with new structure and classes with advance feature and some of the old lagacy features as well with updated code. _Just remeber this_ that the code here will be changed or get updated without any notice. So, keep that in mind when using it to run your bot. Anyway best regards for using the code in this repo. Motivate me by simply giving a star. Wait for _a few weeks_ for the rebuild to be completed. Untill then goodbye.

<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=HOPELESS%20BOT&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>

[![Version][version-shield]][version-shield-link]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Support Server][support-shield]][support-server]
[![MIT License][license-shield]][license-url]
[![CodeQL][codeql]][codeql-url]
[![CodeQL][dependency-review]][dependency-review-url]
[![CodeFactor][code-factor]][code-factor-url]

## Introduction

<center> <a href="https://discord.com/oauth2/authorize?client_id=1272259032098275358"><img src="./public/assets/profile.png"> </a> </center>

**Hopeless Bot** is a multipurpose discord Bot. Specially made for **Moderation** & **Server-Management**. It was made with [discord.js](https://github.com/discordjs/discord.js) a powerful **[Node.JS](https://nodejs.org)** module that allows you to easily interact with the _[Discord API](https://discord.com/developers/docs/intro)_.

[✉️ Invite Hopeless Bot](https://discord.com/oauth2/authorize?client_id=1272259032098275358) • [🆘 Support Server](https://discord.gg/E6H9VvBdTk) • [📝 Bug & Request Feature](https://github.com/theassassin0128/Hopeless-Bot/issues)

## 📊 Road Map

- [x] **Basic Bot**
- [x] **Advance Bot**
- [ ] **Documentation**
- [ ] **Moderation Bot**
- [x] **Music Bot** _(missing some key features)_
- [ ] **Web based Dashboard**
- [ ] **Website**

## 💡 Features

1. **Advance Logger**
1. **Full customizations and configuration**
1. **Advance command and Event Handler**
1. **Advance command synchronizer**
1. **Error logging system**
1. **Validator. (Still in development)**

## ❗Prerequisites❗

Before starting with the **SETUP**, you need to have the following:

- [![Node.JS](https://img.shields.io/badge/Node.js_V18%2B-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download/)
- [![Discord.JS](https://img.shields.io/badge/Discord.JS_V14%2B-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/#/)
- [![Lavalink](https://img.shields.io/badge/Lavalink_V4%2B-fa6f18?style=for-the-badge)](https://github.com/lavalink-devs/lavalink)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/try/download/community)

### Optional

- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/download/) (For PostgreSQL database)
- [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) (For Docker Installation)
- [![Docker-Compose](https://img.shields.io/badge/Docker--Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/) (For Docker Installation)

## 📝 Setup

### 📝 Normal Setup

> ![NOTE]
> Right now the bot still has some major bugs

- **Step 1:** Open `.env.example` copy eveything to a new file named `.env`
- **Step 2:** Put the required values in `.env`
- **Step 3:** Open the terminal and run `npm install`. This installs all the necessary packages
- **Step 5:** Finally run `npm start` in your terminal

### 📝 Setup with Docker

**Note:** Missing docker compose config files (Will be updated soon)

- **Step 1:** Open `env.example`
- **Step 2:** Put the required values and rename it to `.env`
- **Step 3:** Run `docker-compose build`
- **Step 4:** Finally run `docker-compose up`

### 📝 Replit Guide

**Will be updated in next update**

> [!NOTE]
>
> By default, the bot will make most slash & contextmenu commands available for every server. To load slash commands to a private server, go to a command file, change value of `global` to `false`.

### **Need help with setup?**

Join our [Discord Server](https://discord.gg/E6H9VvBdTk) and ask for help in the `#support` channel!

## Customization

[`config.js`](https://github.com/theassassin0128/Hopeless-Bot/tree/main/src/config/config.js) is a config module dedicated for bot's config and other stuff. Change the values according to your need.

> [!IMPORTANT]
> Use hex color code for Embed colors. I recommend using hex colors from [colors.json](https://github.com/theassassin0128/Hopeless-Bot/tree/main/src/colors.json) through `client.config.colors.(Color)`

## Commands

Written below are some public commands of the bot.

| Slash       | Prefix      | description                             |
| ----------- | ----------- | --------------------------------------- |
| /botinfo    | ?botinfo    | View bot's status & runtime status      |
| /invite     | ?invite     | Get a button with embeded invite-link.  |
| /ping       | ?ping       | View bot's ping, response & uptime      |
| /serverinfo | ?serverinfo | View information about a discord server |
| /memberinfo | ?memberinfo | View information of a discord user      |

## 🔗 Useful Links

- [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download/)
- [![Discord.js](https://img.shields.io/badge/Discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/#/)
- [![Lavalink](https://img.shields.io/badge/Lavalink-fa6f18?style=for-the-badge&logo=discord&logoColor=white)](https://github.com/lavalink-devs/Lavalink)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/try/download/community)
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/download/)
- [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
- [![Docker-Compose](https://img.shields.io/badge/Docker--Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

## 📜 Contributing

Thank you for your interest in contributing to Hopeless-Bot! Here are some guidelines to follow when contributing:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Write clean and concise code that follows the established coding style.
3. Create detailed and thorough documentation for any new features or changes.
4. Write and run tests for your code.
5. Submit a pull request with your changes.
   Your contribution will be reviewed, and any necessary feedback or changes will be discussed with you. We appreciate your help in making Hopeless Bot better!

## 🔐 License

Distributed under the MIT license. See ![LICENSE](https://img.shields.io/github/license/theassassin0128/Hopeless-Bot?style=social) for more information.

## 🫡 Credit

- [@lyxcode](https://www.youtube.com/@Lyx) Has some good content on YouTube about discord bots.
- [@discord-js-bot](https://github.com/saiteja-madha/discord-js-bot) Took inspiration and tried to improve this project.
- [@PCBBD-UTILITES](https://github.com/pcbuilderbd/PCBBD-UTILITIES) Got idea to use [colors](https://www.npmjs.com/package/colors) in `console.log()`.
- [@lavamusic](https://github.com/appujet/lavamusic) The README.md looks quite good. See the Similarity.
- [@UnderCtrl](https://www.youtube.com/@UnderCtrl) Got the initial idea for SyncCommand feature
- [@Bord-Pi](https://github.com/thomasbnt/Bord-Pi) Solved some problems of SyncCommand feature from [A post on CodeDev](https://dev.to/mrrobot/creating-a-discord-bot-with-slash-commands-51fa)

[version-shield]: https://img.shields.io/github/package-json/v/theassassin0128/Hopeless-Bot?style=for-the-badge
[version-shield-link]: https://github.com/theassassin0128/Hopeless-Bot/tree/main/package.json
[contributors-shield]: https://img.shields.io/github/contributors/theassassin0128/Hopeless-Bot.svg?style=for-the-badge
[contributors-url]: https://github.com/theassassin0128/Hopeless-Bot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/theassassin0128/Hopeless-Bot.svg?style=for-the-badge
[forks-url]: https://github.com/theassassin0128/Hopeless-Bot/network/members
[stars-shield]: https://img.shields.io/github/stars/theassassin0128/Hopeless-Bot.svg?style=for-the-badge
[stars-url]: https://github.com/theassassin0128/Hopeless-Bot/stargazers
[issues-shield]: https://img.shields.io/github/issues/theassassin0128/Hopeless-Bot.svg?style=for-the-badge
[issues-url]: https://github.com/theassassin0128/Hopeless-Bot/issues
[license-shield]: https://img.shields.io/github/license/theassassin0128/Hopeless-Bot.svg?style=for-the-badge
[license-url]: https://github.com/theassassin0128/Hopeless-Bot/blob/master/LICENSE
[support-server]: https://discord.gg/E6H9VvBdTk
[support-shield]: https://img.shields.io/discord/1054284394791178291.svg?style=for-the-badge&logo=discord&colorB=7289DA
[codeql]: https://img.shields.io/github/actions/workflow/status/theassassin0128/Hopeless-Bot/codeql.yml?style=for-the-badge&label=CodeQL
[codeql-url]: https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/codeql.yml
[dependency-review]: https://img.shields.io/github/actions/workflow/status/theassassin0128/Hopeless-Bot/dependency-review.yml?style=for-the-badge&label=Dependency%20Review
[dependency-review-url]: https://github.com/theassassin0128/Hopeless-Bot/actions/workflows/dependency-review.yml
[code-factor]: https://img.shields.io/codefactor/grade/github/theassassin0128/Hopeless-Bot?style=for-the-badge&logo=codefactor&logoColor=%23F44A6A
[code-factor-url]: https://www.codefactor.io/repository/github/theassassin0128/hopeless-bot/overview/main
