/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "error",
  node: true,
  /**
   * typings for parameters
   * @param {import("@lib/DiscordBot.js").DiscordBot} client
   * @param {Error} error
   */
  execute: async (client, error) => {
    //return;
  },
};
