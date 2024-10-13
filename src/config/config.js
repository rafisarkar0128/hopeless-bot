const {
  DISCORD_CLIENT_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  MYANIMELIST_CLIENT_ID,
  MYANIMELIST_CLIENT_SECRET,
  DEFAULT_PREFIX,
  OWNER_ID,
  SERVER_ID,
  DEVELOPER_IDS,
} = process.env;

module.exports = {
  // basic settings
  defualt_locale: "en_us",

  // bot secrets
  bot_token: DISCORD_CLIENT_TOKEN,
  bot_id: DISCORD_CLIENT_ID,
  bot_secret: DISCORD_CLIENT_SECRET,

  // spotify secrets
  spotify_client_id: SPOTIFY_CLIENT_ID,
  spotify_client_iecret: SPOTIFY_CLIENT_SECRET,

  // myanimelist secrets
  myanimelist_client_d: MYANIMELIST_CLIENT_ID,
  myanimelist_client_secret: MYANIMELIST_CLIENT_SECRET,

  // bot configs
  default_prefix: DEFAULT_PREFIX,
  owner_id: OWNER_ID,
  guild_id: SERVER_ID,
  devs: DEVELOPER_IDS,

  // mongodb config
  mongo_uri: process.env.MONGO_URI,

  // command settings
  commands: {
    prefix: {
      enabled: true,
    },
    slash: {
      enabled: true,
    },
    context: {
      enabled: true,
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
      event: false,
      command: false,
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
