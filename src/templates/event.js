// Base Discord Event Structure

/** @type {import("@types/events").DiscordEventStructure} */
module.exports = {
    name: "",
    once: false,
    rest: false,
    ws: false,
    execute: async (client, ...args) => {},
};

// Base Moonlink Event Structure

/** @type {import("@types/events").MoonlinkEventStructure} */
module.exports = {
    name: "",
    moonlink: true,
    execute: async (client, ...args) => {},
};
