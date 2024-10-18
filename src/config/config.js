module.exports = {
  // basic settings
  default_locale: "en", // refer to the docs to get a list available languages

  // bot secrets
  bot_token: process.env.DISCORD_CLIENT_TOKEN,
  bot_id: process.env.DISCORD_CLIENT_ID,
  bot_secret: process.env.DISCORD_CLIENT_SECRET,

  // spotify secrets
  spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
  spotify_client_iecret: process.env.SPOTIFY_CLIENT_SECRET,

  // myanimelist secrets
  myanimelist_client_d: process.env.MYANIMELIST_CLIENT_ID,
  myanimelist_client_secret: process.env.MYANIMELIST_CLIENT_SECRET,

  // bot configs
  default_prefix: process.env.DEFAULT_PREFIX,
  owner_id: process.env.OWNER_ID,
  guild_id: process.env.SERVER_ID,
  devs: process.env.DEVELOPER_IDS,

  // mongodb config
  mongo_uri: process.env.MONGO_URI,

  // command settings
  commands: {
    prefix: {
      enabled: true,
    },
    slash: {
      enabled: true,
      global: true,
    },
    context: {
      enabled: true,
      global: true,
    },
    buttons: {
      enabled: false,
    },
    modals: {
      enabled: false,
    },
  },
  console: {
    // refer to https://moment.github.io/luxon/#/formatting?id=table-of-tokens for time formats;
    time_format: "dd/LL/yyyy - HH:mm:ss",
    debug: {
      mainLogo: true,
      event: true,
      command: true,
      sync: true,
    },
  },
  server_links: {
    supportServer: "https://discord.gg/E6H9VvBdTk",
  },
  image_links: {
    glitch:
      "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png",
  },
  cache_size: {
    guilds: 100,
    users: 10000,
    members: 10000,
  },

  emojis: require("./emojis"),
  categories: require("./categories"),
  plugins: require("./plugins"),
};
