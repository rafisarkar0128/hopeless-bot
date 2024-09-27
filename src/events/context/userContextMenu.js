const { UserContextMenuCommandInteraction } = require("discord.js");

/** @type {import("@src/index").EventStructure} */
module.exports = {
    name: "interactionCreate",
    once: false,
    rest: false,
    /**
     * @param {UserContextMenuCommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!interaction.isUserContextMenuCommand()) return;

        const { config, colors, utils } = client;
        const { commandName, user, member, guild } = interaction;

        try {
            const context = client.context.get(commandName);

            const mCommand = new EmbedBuilder()
                .setTitle("**This command isn't available. Try again after sometime.**")
                .setColor(colors.Wrong);
            if (!context) {
                return interaction.reply({
                    embeds: [mCommand],
                    ephemeral: true,
                });
            }

            const dCommand = new EmbedBuilder()
                .setTitle("**This command is disabled by the __Owner__ or __Devs__**.")
                .setColor(colors.Wrong);
            if (context.disabled) {
                return interaction.reply({
                    embeds: [dCommand],
                    ephemeral: true,
                });
            }

            const gCommand = new EmbedBuilder()
                .setTitle(
                    `**This command can only be used in a __Guild (Discord Server)__**`,
                )
                .setColor(colors.Wrong);
            if (context.guildOnly && !interaction.inGuild()) {
                return interaction.reply({
                    embeds: [gCommand],
                    ephemeral: true,
                });
            }

            const cooldown = await utils.onCoolDown(interaction, context);
            const cCommand = new EmbedBuilder()
                .setTitle(
                    `**Chill! Command in on cool down wait for \`${cooldown}\` seconds**`,
                )
                .setColor(colors.Wrong);
            if (cooldown && !config.devs.includes(user.id)) {
                return interaction.reply({
                    embeds: [cCommand],
                    ephemeral: true,
                });
            }

            const dvCommand = new EmbedBuilder()
                .setTitle(`**Only Devs are allowed to use this command.**`)
                .setColor(colors.Wrong);
            if (context.devOnly && !config.devs.includes(user.id)) {
                return interaction.reply({
                    embeds: [dvCommand],
                    ephemeral: true,
                });
            }

            const uPermission = new EmbedBuilder()
                .setTitle(
                    `**You need \`${utils.parsePermissions(
                        command.userPermissions,
                    )}\` to use this command.**`,
                )
                .setColor(colors.Wrong);
            if (!member.permissions.has(context?.userPermissions)) {
                return interaction.reply({
                    embeds: [uPermission],
                    ephemeral: true,
                });
            }

            const bPermission = new EmbedBuilder()
                .setTitle(
                    `**I need ${utils.parsePermissions(
                        command.botPermissions,
                    )} to execute this command.**`,
                )
                .setColor(colors.Wrong);
            if (!guild.members.me.permissions.has(context?.botPermissions)) {
                return interaction.reply({
                    embeds: [bPermission],
                    ephemeral: true,
                });
            }

            return context.execute(client, interaction);
        } catch (error) {
            const eCommand = new EmbedBuilder()
                .setColor(colors.StandBy)
                .setTitle(`** An error has occurred! Try again later!**`);

            if (interaction.isRepliable() || !interaction.replied) {
                interaction.reply({
                    content: `${interaction.user}`,
                    embeds: [eCommand],
                    ephemeral: true,
                });
            }

            if (interaction.replied || interaction.deferred) {
                const message = await interaction.editReply({
                    content: `${interaction.user}`,
                    embeds: [eCommand],
                });

                setTimeout(() => {
                    message.delete();
                }, 9000);
            }

            throw error;
        }
    },
};
