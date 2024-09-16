/**
 * @param {import("../structures/DiscordBot.js").DiscordBot} client
 * @param {string} dirname - Default directory for command files is "commands"
 */
module.exports = async (client, { dirname = "commands" }) => {
    let Commands = [];
    let SlashCommandsData = [];

    const files = await client.loadFiles(dirname);
    for (const file of files) {
        const command = require(file);

        Commands.push(command);
        if (command.data) SlashCommandsData.push(command.data.toJSON());
    }

    return { Commands, SlashCommandsData };
};
