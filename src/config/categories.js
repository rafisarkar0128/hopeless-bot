const plugins = require("./plugins");

module.exports = {
  admin: {
    name: "Admin",
    image:
      "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "⚙️",
  },
  automod: {
    name: "Automod",
    enabled: plugins.auto_moderation.enabled,
    image:
      "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "🤖",
  },
  anime: {
    name: "Anime",
    image: "https://wallpaperaccess.com/full/5680679.jpg",
    emoji: "🎨",
  },
  config: {
    name: "Config",
    image: "",
    emoji: "⚙️",
  },
  economy: {
    name: "Economy",
    enabled: plugins.economy.enabled,
    image:
      "https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/128/coins-icon.png",
    emoji: "🪙",
  },
  fun: {
    name: "Fun",
    image:
      "https://icons.iconarchive.com/icons/flameia/aqua-smiles/128/make-fun-icon.png",
    emoji: "😂",
  },
  giveaways: {
    name: "Giveaway",
    enabled: plugins.giveaways.enabled,
    image: "https://cdn-icons-png.flaticon.com/512/4470/4470928.png",
    emoji: "🎉",
  },
  image: {
    name: "Image",
    enabled: plugins.image.enabled,
    image: "https://icons.iconarchive.com/icons/dapino/summer-holiday/128/photo-icon.png",
    emoji: "🖼️",
  },
  information: {
    name: "Information",
    image:
      "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
    emoji: "🪧",
  },
  moderation: {
    name: "Moderation",
    enabled: plugins.moderation.enabled,
    image:
      "https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png",
    emoji: "🔨",
  },
  music: {
    name: "Music",
    enabled: plugins.music.enabled,
    image:
      "https://icons.iconarchive.com/icons/wwalczyszyn/iwindows/256/Music-Library-icon.png",
    emoji: "🎵",
  },
  development: {
    name: "Development",
    image:
      "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
    emoji: "🤴",
  },
  social: {
    name: "Social",
    image:
      "https://icons.iconarchive.com/icons/dryicons/aesthetica-2/128/community-users-icon.png",
    emoji: "🫂",
  },
  rank: {
    name: "Ranking",
    enabled: plugins.rank.enabled,
    image:
      "https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png",
    emoji: "📈",
  },
  suggestion: {
    name: "Suggestion",
    enabled: plugins.suggestion.enabled,
    image: "https://cdn-icons-png.flaticon.com/512/1484/1484815.png",
    emoji: "📝",
  },
  ticket: {
    name: "Ticket",
    enabled: plugins.ticket.enabled,
    image:
      "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/ticket-icon.png",
    emoji: "🎫",
  },
  utility: {
    name: "Utility",
    image:
      "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png",
    emoji: "🛠",
  },
};
