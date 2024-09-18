const { Collection, Routes } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");
const fetchSlashCommands = require("./fetchSlashCommands.js");

/**
 * @param {import("../lib/DiscordBot.js").DiscordBot} client
 * @param {string} dirname - Default directory for command files is "commands"
 */
module.exports = async (client, { dirname = "commands" }) => {
    try {
        const slashCommandData = new Array();
        const files = await client.utils.loadFiles(dirname);
        client.commands.clear();

        for (const file of files) {
            const command = require(file);
            try {
                if (command.enabled === false) return;
                if (command.cooldown) {
                    client.cooldowns.set(command.data?.name, new Collection());
                }

                if (command.aliases?.length) {
                    // /client.logger.log(command.aliases);
                }

                client.commands.set(command.data.name, command);
                if (command.data) slashCommandData.push(command.data.toJSON());
            } catch (error) {
                throw error;
            }
        }

        client.logger.info(
            colors.blue(
                `loaded ${colors.yellow(client.commands.size)} command module`,
            ),
        );

        client.logger.write(
            colors.gray("📩 Fetching slash commands from discord...."),
        );
        await client.wait(2000);
        const fetchtedCommands = await fetchSlashCommands(client);
        client.logger.write(
            colors.yellow(
                `📦 Found ${fetchtedCommands.length} slash commands.`,
            ),
        );

        client.rest.put(
            Routes.applicationGuildCommands(
                client.config.bot.id,
                client.config.serverId,
            ),
            {
                body: slashCommandData,
            },
        );
    } catch (error) {
        client.utils.sendError(error, {
            origin: "src/helpers/laodCommands.js",
            type: "internal",
        });
        throw error;
    }
};

/*
 * @param {import("../structures/DiscordBot.js").DiscordBot} client
 
module.exports = async (client) => {
    try {
        commands.forEach(
            /*
             * @param {import("../structures/CommandStructure.js").CommandStructure} command
             *
            async (command) => {
                
            },
        );

        //client.info(colors.yellow("🔎 Checking for changes in Slash Commands"));

        

        //console.log(currentSlashCommands.length, currentSlashCommands);
        
    } catch (error) {
        client.logger.error(error);
    }
};
*/
