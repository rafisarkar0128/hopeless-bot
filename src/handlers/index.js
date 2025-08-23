const { handleAutoplay } = require("./lavalink/handleAutoplay");
const { handleSlash } = require("./command/handleSlash");
const { handleAutocomplete } = require("./command/handleAutocomplete");
const { handlePrefix } = require("./command/handlePrefix");

module.exports = {
  handleAutoplay,
  handleSlash,
  handleAutocomplete,
  handlePrefix,
};
