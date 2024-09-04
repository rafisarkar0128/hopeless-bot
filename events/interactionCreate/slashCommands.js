const {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} = require("discord.js");
const { onCoolDown } = require("../../utils/cooldown.utils.js");

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
            const command = await client.slashCommands.get(
                interaction.commandName
            );

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
                        interaction.options.getSubcommand()
                );
                if (!subCommand) {
                    return interaction.reply({
                        content: "The Sub Command isn't available right now.",
                        ephemeral: true,
                    });
                }
                return subCommand.execute(client, interaction);
            }
        } catch (error) {
            if (
                interaction.replied ||
                interaction.deferred ||
                !interaction.isRepliable()
            ) {
                await interaction.deleteReply();
            }

            const message = await interaction.channel.send({
                content: `${interaction.user}`,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.StandBy)
                        .setTitle(
                            `<:error_logo:1276700084293079161> An error has occured! Try again later!`
                        ),
                ],
            });
            setTimeout(() => {
                message.delete();
            }, 9000);

            // /await client.sendErrors(client, interaction, error);
            throw error;
        }
    },
};
