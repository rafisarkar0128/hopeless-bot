/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "raw",
  once: false,
  execute: async (client, data) => {
    // Updating the Moonlink.js package with the necessary data
    client.moonlink.packetUpdate(data);
  },
};
