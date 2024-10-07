/** @type {import("@types/events").EventStructure} */
module.exports = {
    name: "nodeCreate",
    once: false,
    rest: false,
    ws: false,
    moonlink: true,
    /** @param {import("moonlink.js").Node} node */
    execute: async (client, node) => {
        client.logger.info(`${node.host} was connected, and the magic is in the air`);
    },
};
