/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "raw",
  once: false,
  execute: async (client, data) => {
    // sending raw voice data to the music player;
    client.lavalink.sendRawData(data);
  },
};
