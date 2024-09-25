const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

/** @type {import("@src/index").EventStructure} */
module.exports = {
    name: "interactionCreate",
    once: false,
    rest: false,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const { config, colors, utils } = client;
        const { commandName, user, member, guild } = interaction;

        try {
            const command = client.commands.get(commandName);
            if (!command) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                "**This command isn't available. Try again after sometime.**",
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            if (command.disabled) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                "**This command is disabled by the __Owner__ or __Devs__**.",
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            if (command.guildOnly) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                `**This command can only be used in a __Guild (Discord Server)__**`,
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            const cooldown = await utils.onCoolDown(interaction, command);
            if (cooldown && !config.devs.includes(user.id)) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                `**Chill! Command in on cool down wait for \`${cooldown}\` seconds**`,
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            if (command.devOnly) {
                if (!config.devs.includes(interaction.user.id)) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    `**Only Devs are allowed to use this command.**`,
                                )
                                .setColor(colors.Wrong),
                        ],
                        ephemeral: true,
                    });
                }
            }

            if (!member.permissions.has(command.userPermissions)) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                `**You need \`${utils.parsePermissions(
                                    command.userPermissions,
                                )}\` to use this command.**`,
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            if (!guild.members.me.permissions.has(command.botPermissions)) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                `**I need ${utils.parsePermissions(
                                    command.botPermissions,
                                )} to execute this command.**`,
                            )
                            .setColor(colors.Wrong),
                    ],
                    ephemeral: true,
                });
            }

            return command.execute(client, interaction);
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
                        .setColor(colors.StandBy)
                        .setTitle(`** An error has occurred! Try again later!**`),
                ],
            });

            setTimeout(() => {
                message.delete();
            }, 9000);

            throw error;
        }
    },
};
