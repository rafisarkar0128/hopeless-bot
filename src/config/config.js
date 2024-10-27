module.exports = {
  // Locale settings
  default_locale: process.env.DEFAULT_LOCALE,

  // Bot secrets
  bot_token: process.env.DISCORD_CLIENT_TOKEN,
  bot_id: process.env.DISCORD_CLIENT_ID,
  bot_secret: process.env.DISCORD_CLIENT_SECRET,

  // Spotify secrets
  spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
  spotify_client_iecret: process.env.SPOTIFY_CLIENT_SECRET,

  // Myanimelist secrets
  myanimelist_client_d: process.env.MYANIMELIST_CLIENT_ID,
  myanimelist_client_secret: process.env.MYANIMELIST_CLIENT_SECRET,

  // Bot configs
  default_prefix: process.env.DEFAULT_PREFIX,
  owner_id: process.env.OWNER_ID,
  guild_id: process.env.SERVER_ID,
  devs: process.env.DEVELOPER_IDS.split(", "),

  // Mongodb config
  mongo_uri: process.env.MONGO_URI,

  // Invite config
  allowedInvite: false,

  // Command settings. Set true to enable & false to disable
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
    time_format: process.env.TIME_FORMAT,
    // Set true to enable & false to disable
    debug: {
      event_table: true,
      command_table: true,
      sync: true,
      sync_table: true,
    },
    // Table border styles
    default_table_border: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,

      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,

      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,

      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`,
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

  icons: {
    youtube: "https://i.imgur.com/xzVHhFY.png",
    spotify: "https://i.imgur.com/qvdqtsc.png",
    soundcloud: "https://i.imgur.com/MVnJ7mj.png",
    applemusic: "https://i.imgur.com/Wi0oyYm.png",
    deezer: "https://i.imgur.com/xyZ43FG.png",
    jiosaavn: "https://i.imgur.com/N9Nt80h.png",
  },

  // For embeds colors. Can be used anywhere
  colors: require("./colors.json"),
  emojis: require("./emojis"),
  categories: require("./categories"),
  plugins: require("./plugins"),
};
