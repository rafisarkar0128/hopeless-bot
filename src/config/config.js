module.exports = {
  bot: {
    defaultPrefix: process.env.DEFAULT_PREFIX,
    id: process.env.BOT_ID,
    token: process.env.BOT_TOKEN,
    secret: process.env.BOT_SECRET,
    invite: process.env.ALLOWED_INVITE,
    footer: `Copyright © 2023 - ${new Date().getFullYear()} | @${process.env.OWNER_NAME}`,
  },
  ownerId: process.env.OWNER_ID,
  guildId: process.env.SERVER_ID,
  devs: process.env.DEVELOPER_IDS,
  mongodbUri: process.env.MONGO_URI,
  antiCrash: {
    enabled: true,
  },
  enabled_commands: {
    prefix: true,
    slash: true,
    context: true,
    buttons: false,
    modals: false,
  },
  console: {
    // refer to https://moment.github.io/luxon/#/formatting?id=table-of-tokens for time formats;
    timeFormat: "dd/LL/yyyy - HH:mm:ss",
    loaders: {
      event: false,
      command: false,
      context: true,
    },
  },
  links: {
    supportServer: "https://discord.gg/E6H9VvBdTk",
  },
  imageLinks: {
    glitch:
      "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png",
  },
  cacheSize: {
    guilds: 100,
    users: 10000,
    members: 10000,
  },

  emojis: require("./emojis"),
  categories: require("./categories"),
  plugins: require("./plugins"),
};
