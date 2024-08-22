const { ChatInputCommandInteraction, Client } = require("discord.js");
const { onCoolDown } = require("../../utils/cooldown.util.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    rest: false,
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns
     */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        try {
            const command = await client.commands.get(interaction.commandName);

            if (!command) {
                return interaction.reply({
                    content: "This command isn't available.",
                    ephemeral: true,
                });
            }

            if (command.toggleOff) {
                return interaction.reply({
                    content: "This command isn't available right now.",
                    ephemeral: true,
                });
            }

            const cooldown = await onCoolDown(client, interaction, command);
            if (cooldown && !client.config.devs.includes(interaction.user.id)) {
                return interaction.reply({
                    content: `Chill! Command in on cooldown.\n\`\`\`m\nWait for ${cooldown} seconds\n\`\`\``,
                    ephemeral: true,
                });
            }

            if (command.devOnly) {
                if (!client.config.devs.includes(interaction.user.id)) {
                    return interaction.reply({
                        content: `**Only Devs are allowed to use this command.**`,
                        ephemeral: true,
                    });
                }
            }

            if (command.userPermissions?.length) {
                if (
                    !interaction.member.permissions.has(command.userPermissions)
                ) {
                    return interaction.reply({
                        content: `You need \`${command.userPermissions
                            .map((p) => p)
                            .join(", ")}\` permission to use this command.`,
                        ephemeral: true,
                    });
                }
            }

            if (command.botPermissions?.length) {
                if (
                    !interaction.guild.members.me.permissions.has(
                        command.botPermissions
                    )
                ) {
                    return interaction.reply({
                        content: `I need \`${command.botPermissions
                            .map((p) => p)
                            .join(", ")}\` permission to execute this command.`,
                        ephemeral: true,
                    });
                }
            }

            await command.execute(client, interaction);

            if (interaction.options.getSubcommand(false)) {
                var subCommand = await client.subCommands.get(
                    interaction.commandName +
                        "." +
                        interaction.options.getSubcommand()
                );
                if (!subCommand) return;
                return subCommand.execute(client, interaction);
            }
        } catch (error) {
            const reply = await interaction.fetchReply();
            if (reply) {
                interaction.followUp({
                    content: `**An error occured while executing the command.**`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: `**An error occured while executing the command.**`,
                    ephemeral: true,
                });
            }

            throw error;
        }
    },
};
