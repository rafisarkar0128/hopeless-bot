/** @type {import("@types/events").EventStructure} */
module.exports = {
  name: "raw",
  once: false,
  rest: false,
  ws: false,
  moonlink: false,
  execute: async (client, data) => {
    // Updating the Moonlink.js package with the necessary data
    client.moonlink.packetUpdate(data);
  },
};
