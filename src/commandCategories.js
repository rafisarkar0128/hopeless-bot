const config = require("./config.js");

module.exports = {
    ADMIN: {
        name: "Admin",
        image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
        emoji: "⚙️",
    },
    AUTOMOD: {
        name: "Automod",
        enabled: config.automod.enabled,
        image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
        emoji: "🤖",
    },
    ANIME: {
        name: "Anime",
        image: "https://wallpaperaccess.com/full/5680679.jpg",
        emoji: "🎨",
    },
    CONFIG: {
        name: "Config",
        image: "",
        emoji: "⚙️",
    },
    ECONOMY: {
        name: "Economy",
        enabled: config.economy.enabled,
        image: "https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/128/coins-icon.png",
        emoji: "🪙",
    },
    FUN: {
        name: "Fun",
        image: "https://icons.iconarchive.com/icons/flameia/aqua-smiles/128/make-fun-icon.png",
        emoji: "😂",
    },
    GIVEAWAYS: {
        name: "Giveaway",
        enabled: config.giveaways.enabled,
        image: "https://cdn-icons-png.flaticon.com/512/4470/4470928.png",
        emoji: "🎉",
    },
    IMAGE: {
        name: "Image",
        enabled: config.image.enabled,
        image: "https://icons.iconarchive.com/icons/dapino/summer-holiday/128/photo-icon.png",
        emoji: "🖼️",
    },
    INVITE: {
        name: "Invite",
        enabled: process.env.ALLOWED_INVITE,
        image: "https://cdn4.iconfinder.com/data/icons/general-business/150/Invite-512.png",
        emoji: "📨",
    },
    INFORMATION: {
        name: "Information",
        image: "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
        emoji: "🪧",
    },
    MODERATION: {
        name: "Moderation",
        enabled: config.moderation.enabled,
        image: "https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png",
        emoji: "🔨",
    },
    MUSIC: {
        name: "Music",
        enabled: config.music.enabled,
        image: "https://icons.iconarchive.com/icons/wwalczyszyn/iwindows/256/Music-Library-icon.png",
        emoji: "🎵",
    },
    DEVELOPMENT: {
        name: "Development",
        image: "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
        emoji: "🤴",
    },
    SOCIAL: {
        name: "Social",
        image: "https://icons.iconarchive.com/icons/dryicons/aesthetica-2/128/community-users-icon.png",
        emoji: "🫂",
    },
    STATS: {
        name: "Statistics",
        enabled: config.stats.enabled,
        image: "https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png",
        emoji: "📈",
    },
    SUGGESTION: {
        name: "Suggestion",
        enabled: config.suggestion.enabled,
        image: "https://cdn-icons-png.flaticon.com/512/1484/1484815.png",
        emoji: "📝",
    },
    TEST: {
        name: "Test",
        image: "",
        emoji: "🪛",
    },
    TICKET: {
        name: "Ticket",
        enabled: config.ticket.enabled,
        image: "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/ticket-icon.png",
        emoji: "🎫",
    },
    UTILITY: {
        name: "Utility",
        image: "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png",
        emoji: "🛠",
    },
};
