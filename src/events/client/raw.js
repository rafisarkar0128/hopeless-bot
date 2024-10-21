/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "raw",
  once: false,
  execute: async (client, data) => {
    client.lavalink.sendRawData(data);
  },
};
