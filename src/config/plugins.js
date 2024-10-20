module.exports = {
  antiCrash: {
    enabled: true,
  },

  auto_moderation: {
    enabled: true,
  },

  dashboard: {
    enabled: true,
    base_url: "",
    failure_url: "",
    port: "3000",
  },

  economy: {
    enabled: true,
    currency: "💵",
    daily_coins: 25,
    min_beg_amount: 10,
    max_beg_amount: 250,
  },

  music: {
    enabled: false,
    idle_time: 180000,
    max_search_results: 10,
    default_source: "YTM",
    lavalink_nodes: [
      // local hosted nodes
      {
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
        secure: false,
        identifier: "Local Node",
      },
      // nodes from https://lavalinks-list.vercel.app/non-ssl
      {
        identifier: "LewdHuTao - Lavalink",
        password: "youshallnotpass",
        host: "node.lewdhutao.my.eu.org",
        port: 80,
        secure: false,
      },
      {
        identifier: "INZEWORLD.COM (DE)",
        password: "saher.inzeworld.com",
        host: "lava.inzeworld.com",
        port: 3128,
        secure: false,
      },
      {
        identifier: "Koi Node V4",
        password: "fypmoon.org",
        host: "nodev4.fypmoon.org",
        port: 1118,
        secure: false,
      },
    ],
  },

  giveaways: {
    enabled: true,
    reaction: "🎁",
  },

  image: {
    enabled: true,
    base_api: "https://strangeapi.fun/api",
  },

  moderation: {
    enabled: true,
    colors: {
      timeout: "#102027",
      umtimeout: "#4B636E",
      kick: "#FF7961",
      softban: "#AF4448",
      ban: "#D32F2F",
      unban: "#00C853",
      vmute: "#102027",
      vunmute: "#4B636E",
      deafen: "#102027",
      undeafen: "#4B636E",
      disconnect: "random",
      move: "#ffcda2",
    },
  },

  rank: {
    enabled: true,
    xp_cool_down: 10,
    default_level_up_message: "{tag}, You just advanced to **Level {level}**",
  },

  suggestion: {
    enabled: true,
    emoji: {
      up_vote: "⬆️",
      down_vote: "⬇️",
    },
  },

  ticket: {
    enabled: true,
  },
};
