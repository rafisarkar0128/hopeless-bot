/** @type {import("@src/index").EventStructure} */

module.exports = {
    name: "raw",
    once: false,
    rest: false,
    /** @param {import("discord.js").RawFile} data*/
    execute: async (client, data) => {
        client.lavalink.sendRawData(data);
    },
};
