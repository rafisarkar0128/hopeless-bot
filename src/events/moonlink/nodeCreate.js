/** @type {import("@types/events").MoonlinkEventStructure} */
module.exports = {
    name: "nodeCreate",
    moonlink: true,
    /** @param {} node */
    execute: async (client, node) => {
        client.logger.info(`${node.host} was connected, and the magic is in the air`);
    },
};
