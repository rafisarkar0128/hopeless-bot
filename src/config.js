const fs = require("fs");
const path = require("path");

/**
 * Gets all available locales by reading the 'src/locales' directory.
 * Each subdirectory in 'src/locales' is considered a locale if it contains language files.
 * @returns {string[]} An array of available locale codes.
 * @example
 * getAvailableLocales(); // Returns ['en-US', 'pt-BR', ...]
 */
function getAvailableLocales() {
  return fs.readdirSync(path.join(process.cwd(), "src/locales")).filter((dir) => {
    const dirPath = path.join(process.cwd(), "src/locales", dir);
    return fs.lstatSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length > 0;
  });
}

module.exports = {
  // default language
  defaultLocale: process.env.DEFAULT_LOCALE ?? "en-US",
  // supported languages
  availableLocales: getAvailableLocales(),

  // Mode of the bot.
  mode: process.env.MODE === "production" ? "production" : "development",
  // Debug mode to log more information
  debug: process.env.DEBUG === "true",

  // whether to show table or not.
  showTable: {
    event: process.env.SHOW_TABLE_EVENT === "true", // event loader table
    command: process.env.SHOW_TABLE_COMMAND === "true", // command loader table
    commandChanges: process.env.SHOW_TABLE_COMMAND_CHANGES === "true", // Command changes table
    commandSync: process.env.SHOW_TABLE_COMMAND_SYNC === "true", // Command syncronization table
  },

  // Bot settings
  bot: {
    id: process.env.DISCORD_CLIENT_ID, // your bots id
    token: process.env.DISCORD_CLIENT_TOKEN, // your bots token
    secret: process.env.DISCORD_CLIENT_SECRET, // your bots secret
    ownerId: process.env.OWNER_ID, // your discord account id
    guildId: process.env.GUILD_ID, // your guild id
    prefix: process.env.DEFAULT_PREFIX, // default prefix
    /**
     * your bots developer ids
     * @type {string[]}
     */
    devs: process.env.DEV_IDS ? JSON.parse(process.env.DEV_IDS) : [],
    global: process.env.GLOBAL_COMMANDS === "true", // Wheither to make the commands global or not
    allowedInvite: process.env.ALLOWED_INVITE === "true", // Whether to allow invite command or not
    defaultCooldown: 5, // Default cooldown ammount in secconds
    defaultPermissions: BigInt("321474581102161"), // Default bot permissions
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
    dbName: "hopeless",
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
  logsChannels: {
    join: process.env.CHANNEL_JOIN,
    leave: process.env.CHANNEL_LEAVE,
    error: process.env.CHANNEL_ERROR,
    command: process.env.CHANNEL_COMMAND,
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

  // Settings for the lavalink music system
  lavalink: {
    // Idle time in milliseconds before disconnecting
    idleTime: 180000,
    // Maximum search results to display
    maxSearchResults: 10,
    // Default player volume
    defaultVolume: 50,
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
    githubRepo: process.env.GITHUB_REPO,
  },
};
