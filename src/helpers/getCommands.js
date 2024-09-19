/** Funtion to load commands
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {string} dirname
 */
module.exports = async (client, dirname = "commands") => {
    const Commands = new Array();
    const ApplicationCommands = new Array();
    const files = await client.utils.loadFiles(dirname, ".js");

    for (const file of files) {
        const command = require(file);
        Commands.push(command);
        if (command.data) ApplicationCommands.push(command.data.toJSON());
    }

    return { Commands, ApplicationCommands };
};
