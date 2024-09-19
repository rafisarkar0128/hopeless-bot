// Command Structure
/**
 * @type {import("@src/index").CommandStructure}
 */
module.exports = {
    data: new SlashCommandBuilder(),
    aliases: [],
    minArgsCount: 0,
    usage: "",
    cooldown: 0,
    category: "NONE",
    premium: false,
    botPermissions: [],
    userPermissions: [],
    run: (client, message, args, data) => {},
    execute: (client, interaction, data) => {},
};

// Event Structure
/**
 * @type {import("@src/index").EventStructure}
 */
module.exports = {
    name: "",
    once: false,
    rest: false,
    execute: (client, ...args) => {},
};
