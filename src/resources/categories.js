const config = require("@src/config.js");

const Categories = {
  admin: {
    name: "Admin",
    image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "👨‍⚖️",
  },

  config: {
    name: "config",
    image: "https://icons.iconarchive.com/icons/froyoshark/enkel/128/Settings-icon.png",
    emoji: "⚙️",
  },

  developer: {
    name: "Developer",
    image:
      "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
    emoji: "🤴",
  },

  general: {
    name: "General",
    image: "",
    emoji: "🏘️",
  },

  information: {
    name: "Information",
    image: "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
    emoji: "🪧",
  },

  music: {
    name: "Music",
    enabled: config.music.enabled,
    image: "https://icons.iconarchive.com/icons/wwalczyszyn/iwindows/256/Music-Library-icon.png",
    emoji: "🎵",
  },


  utility: {
    name: "Utility",
    image:
      "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png",
    emoji: "🛠",
  },
};

module.exports = { Categories };
