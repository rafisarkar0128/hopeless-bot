const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");

module.exports = {
  // default language
  defaultLocale: process.env.DEFAULT_LOCALE ?? "en-US",
  // Available languages for the bot
  availableLocales: readdirSync(join(process.cwd(), "src", "locales")).filter((file) => {
    const isDirectory = lstatSync(join(process.cwd(), "src", "locales", file)).isDirectory();
    const langFiles = readdirSync(join(process.cwd(), "src", "locales", file));
    if (isDirectory && langFiles.length > 0) return true;
  }),

  // whether to show table or not.
  showTable: {
    event: process.env.SHOW_TABLE_EVENT === "true", // event loader table
    command: process.env.SHOW_TABLE_COMMAND === "true", // command loader table
    commandChanges: process.env.SHOW_TABLE_COMMAND_CHANGES === "true", // Command changes table
    commandSync: process.env.SHOW_TABLE_COMMAND_SYNC === "true", // Command syncronization table
  },

  // Bot settings
  bot: {
    // your bots id
    id: process.env.DISCORD_CLIENT_ID,
    // your bots token
    token: process.env.DISCORD_CLIENT_TOKEN,
    // your bots secret
    secret: process.env.DISCORD_CLIENT_SECRET,
    // your discord account id
    ownerId: process.env.OWNER_ID,
    // your guild id
    guildId: process.env.GUILD_ID,
    // default prefix
    prefix: process.env.DEFAULT_PREFIX,
    /**
     * your bots developer ids
     * @type {string[]}
     */
    devs: process.env.DEV_IDS ? JSON.parse(process.env.DEV_IDS) : [],
    // Wheither to make the commands global or not
    global: process.env.GLOBAL_COMMANDS === "true",
    // Whether to allow invite command or not
    allowedInvite: process.env.ALLOWED_INVITE === "true",
    // Default cooldown ammount in secconds
    defaultCooldown: 5,
    // debug mode to log more information
    debug: process.env.DEBUG === "true",
  },

  // Your genius API credentials. Get it from https://genius.com/developers
  genius: {
    id: process.env.GENIUS_CLIENT_ID,
    secret: process.env.GENIUS_CLIENT_SECRET,
    token: process.env.GENIUS_CLIENT_TOKEN,
  },

  // Mongodb URI. Get it from mongodb.com
  mongodbUri: process.env.MONGO_URI,

  /**
   * MongoDB Client options
   * @type {import("mongodb").MongoClientOptions}
   */
  mongodbOptions: {
    dbName: "node",
    timeoutMS: 10000,
    connectTimeoutMS: 30000,
    directConnection: false,
  },

  /**
   * Cache settings for various managers
   * @type {Object<string, import("lru-cache").LRUCache>}
   */
  cacheSettings: {
    GuildManager: {
      max: 25000,
    },
    UserManager: {
      max: 50000,
    },
  },

  // logs ralated config
  logs: {
    general: {
      color: "#36393F",
      channel: process.env.CHANNEL_GENERAL,
    },
    error: {
      color: "#de5d5d",
      channel: process.env.CHANNEL_ERROR,
    },
    command: {
      color: "#7289DA",
      channel: process.env.CHANNEL_COMMAND,
    },
  },

  // Dashboard settings
  dashboard: {
    enabled: true,
    // Base url for the dashboard
    baseUrl: "/",
    // URL to redirect on failure
    failureUrl: "/error",
    // Port for the dashboard
    port: process.env.DASHBOARD_PORT ?? 3000,
  },

  // Settings for the music system
  music: {
    enabled: true,
    // Idle time in milliseconds before disconnecting
    idleTime: 180000,
    // Maximum search results to display
    maxSearchResults: 10,
    // Default player volume
    defaultVolume: 25,
    // Default color to use for embeds
    defaultEmbedColor: "#7289DA",
    // maxiimum volume allowed for the player
    maxVolume: 100,
    /**
     * Default source for the music system
     * ! avoid anything ending with "rec". example: "sprec" or "jsrec"
     * @type {import("lavalink-client").SearchPlatform}
     */
    defaultSearchPlatform: "ytmsearch",
    // Lavalink nodes for the music system
    nodes: require("@root/lavalinkNodes.js"),
  },

  image: {
    enabled: true,
    baseApi: "https://api.trace.moe",
  },

  social: {
    enabled: true,
  },

  // Images to use everywhere
  images: {
    glitch: "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png",
  },

  // Icons for using everywhere
  icons: {
    youtube: "https://i.imgur.com/xzVHhFY.png",
    spotify: "https://i.imgur.com/qvdqtsc.png",
    soundcloud: "https://i.imgur.com/MVnJ7mj.png",
    applemusic: "https://i.imgur.com/Wi0oyYm.png",
    deezer: "https://i.imgur.com/xyZ43FG.png",
    jiosaavn: "https://i.imgur.com/N9Nt80h.png",
  },

  // Links to use everywhere
  links: {
    botWebsite: process.env.BOT_WEBSITE,
    supportServer: process.env.SUPPORT_SERVER,
    githubRepo: "https://github.com/rafisarkar0128/hopeless-bot#readme",
  },
};
