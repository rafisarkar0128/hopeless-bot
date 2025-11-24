[![Version][version-shield]][version-shield-link]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Support Server][support-shield]][support-server]
[![MIT License][license-shield]][license-url]
[![CodeQL][codeql]][codeql-url]
[![Dependency Review][dependency-review]][dependency-review-url]
[![CodeFactor][code-factor]][code-factor-url]

# 🚀 Hopeless - A Discord Music Bot

**Hopeless** is a discord bot, specially made for **Music Streaming**. It is built along with [discord.js](https://github.com/discordjs/discord.js), a powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro), and [Lavalink](https://github.com/lavalink-devs/lavalink), a powerful audio streaming server.

[✉️ Invite Hopeless][bot-invite] • [🆘 Support Server][support-server] • [📝 Bug & Request Feature][issues-url]

## 📊 Road Map

- [x] **Basic Bot**
- [x] **Website**
- [ ] **Dashboard**
- [ ] **Documentation**

## 💡 Features

- **Advanced Logger**
- **Music Streaming**
- **Database Support** (MongoDB, etc.)
- **Slash Commands**
- **Prefix Commands**
- **Lavalink Support**
- **Highly Customizable**
- **Multi-Language Support**
- **Advanced Error Handler**
- **Basic Sharding**
- **Advanced Validation**

## 🔧 Requirements

Before you get started, you need to have the following:

- [![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download/) (Recommend LTS or Higher)
- [![Lavalink](https://img.shields.io/badge/Lavalink-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://github.com/lavalink-devs/lavalink) (V4 or Higher)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/try/download/community) (Required for MongoDB database)

## 🚀 Get Started

1. First clone the repository and change the directory:

```bash
git clone https://github.com/rafisarkar0128/hopeless-bot.git
cd hopeless-bot
```

2. Install the required packages:

```bash
npm install
```

3. Copy `example.lavalink-nodes.js` to `lavalink-nodes.js` and add your external nodes here (if you are going to use any).

4. Copy `.env.example` to `.env` and fill in all the required values.

5. Now go to [Discord Developer Page](https://discord.com/developers/applications) select your application and head to OAuth2 tab. In OAuth2 URL Generator select "bot" and "application.commands" scopes, scroll down select "Administrator" permission, copy the URL, open the URL and invite the bot to your server.

6. Start the bot:

```bash
npm start
npm run dev # if you want to run in dev mode
```

7. Start using the bot. Use `/ping` or `/play` commands.

### NOTE

By default, the bot loads slash commands globally. To load slash commands only in specified guild, go to `.env`, change the value of `GLOBAL_COMMANDS` to `false`. This will make sure that the slash commands are available only in the specified guild.

## 🗝️ Sharding

**Sharding** is not recommended for bots that are in less than **2,000 servers**. By default the bot runs without sharding. To enable sharding, start the bot like this:

```bash
npm run shard
npm run devShard # if you want to run in dev mode
```

## 📜 Commands

> There will be a dedicated markdown file for commands in future.
> For now here are some public commands of the bot.

| Name     | Description                                     |
| -------- | ----------------------------------------------- |
| ping     | 🏓 Pong! Replies with bot's response time.      |
| botinfo  | 📖 View bot's information.                      |
| invite   | returns a link button with bot's invite URL.    |
| language | 🌐 Change your language for the bot.            |
| play     | ▶ Play songs or tracks from available sources. |

## 🤝 Contributing

Please check the [issues page](https://github.com/rafisarkar0128/hopeless-bot/issues) for open issues and feature requests.

Thank you for your interest in contributing to this project! Remember to follow these guidelines when contributing:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Write clean and concise code that follows the established coding style.
3. Create detailed and thorough documentation for any new features or changes.
4. Write and run tests for your code.
5. Submit a pull request with your changes. Your contribution will be reviewed, and any necessary feedback or changes will be discussed with you.

💖 I appreciate your help in making this project better!

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Contributors

Thanks go to these wonderful people for their contributions:

<a href="https://github.com/rafisarkar0128/hopeless-bot/graphs/contributors">
<img src="https://contrib.rocks/image?repo=rafisarkar0128/hopeless-bot" />
</a>

[bot-invite]: https://discord.com/oauth2/authorize?client_id=1272259032098275358
[version-shield]: https://img.shields.io/github/package-json/v/rafisarkar0128/hopeless-bot?style=for-the-badge
[version-shield-link]: https://github.com/rafisarkar0128/hopeless-bot
[contributors-shield]: https://img.shields.io/github/contributors/rafisarkar0128/hopeless-bot?style=for-the-badge
[contributors-url]: https://github.com/rafisarkar0128/hopeless-bot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rafisarkar0128/hopeless-bot?style=for-the-badge
[forks-url]: https://github.com/rafisarkar0128/hopeless-bot/network/members
[stars-shield]: https://img.shields.io/github/stars/rafisarkar0128/hopeless-bot?style=for-the-badge
[stars-url]: https://github.com/rafisarkar0128/hopeless-bot/stargazers
[issues-shield]: https://img.shields.io/github/issues/rafisarkar0128/hopeless-bot?style=for-the-badge
[issues-url]: https://github.com/rafisarkar0128/hopeless-bot/issues
[support-shield]: https://img.shields.io/discord/1054284394791178291?logo=discord&colorB=7289DA&style=for-the-badge
[support-server]: https://discord.gg/E6H9VvBdTk
[license-shield]: https://img.shields.io/github/license/rafisarkar0128/hopeless-bot?style=for-the-badge
[license-url]: https://github.com/rafisarkar0128/hopeless-bot/blob/master/LICENSE
[codeql]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/hopeless-bot/codeql.yml?style=for-the-badge&logo=github&label=Codeql
[codeql-url]: https://github.com/rafisarkar0128/hopeless-bot/actions/workflows/codeql.yml
[dependency-review]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/hopeless-bot/dependency-review.yml?style=for-the-badge&label=Dependency%20Review&logo=github
[dependency-review-url]: https://github.com/rafisarkar0128/hopeless-bot/actions?query=workflow%3A%22Dependency+Review%22
[code-factor]: https://img.shields.io/codefactor/grade/github/rafisarkar0128/node?logo=codefactor&logoColor=%23F44A6A&style=for-the-badge
[code-factor-url]: https://www.codefactor.io/repository/github/rafisarkar0128/node
