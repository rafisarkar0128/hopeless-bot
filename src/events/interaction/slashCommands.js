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

            const mEmbed = new EmbedBuilder()
                .setTitle("**This command isn't available. Try again after sometime.**")
                .setColor(colors.Wrong);
            if (!command) {
                return interaction.reply({
                    embeds: [mEmbed],
                    ephemeral: true,
                });
            }

            const dEmbed = new EmbedBuilder()
                .setTitle("**This command is disabled by the __Owner__ or __Devs__**.")
                .setColor(colors.Wrong);
            if (command.disabled.slash && !config.devs.includes(user.id)) {
                return interaction.reply({
                    embeds: [dEmbed],
                    ephemeral: true,
                });
            }

            const dvEmbed = new EmbedBuilder()
                .setTitle(
                    `**Only the owner or developers are allowed to use this command.**`,
                )
                .setColor(colors.Wrong);
            if (
                (command.devOnly || command.category === "DEVELOPMENT") &&
                !config.devs.includes(user.id)
            ) {
                return interaction.reply({
                    embeds: [dvEmbed],
                    ephemeral: true,
                });
            }

            const gEmbed = new EmbedBuilder()
                .setTitle(
                    `**This command can only be used in a __Guild (Discord Server)__**`,
                )
                .setColor(colors.Wrong);
            if (command.guildOnly && !interaction.inGuild()) {
                return interaction.reply({
                    embeds: [gEmbed],
                    ephemeral: true,
                });
            }

            const timestamps = client.cooldowns.get(command.data.name);
            const cooldown = (command.cooldown || 3) * 1000;
            const remainingTime = utils.getRemainingTime(timestamps, cooldown, user.id);
            const cdEmbed = new EmbedBuilder()
                .setTitle(
                    `**Chill! Embed in on cooldown wait for \`${remainingTime}\` seconds**`,
                )
                .setColor(colors.Wrong);
            if (remainingTime && !config.devs.includes(user.id)) {
                return interaction.reply({
                    embeds: [cdEmbed],
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
            if (member && !member.permissions.has(command?.userPermissions)) {
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
            if (member && !guild.members.me.permissions.has(command?.botPermissions)) {
                return interaction.reply({
                    embeds: [bPermission],
                    ephemeral: true,
                });
            }

            return command.execute(client, interaction);
        } catch (error) {
            const eEmbed = new EmbedBuilder()
                .setColor(colors.StandBy)
                .setTitle(`** An error has occurred! Try again later!**`);

            if (interaction.isRepliable() || !interaction.replied) {
                interaction.reply({
                    content: `${interaction.user}`,
                    embeds: [eEmbed],
                    ephemeral: true,
                });
            }

            if (interaction.replied || interaction.deferred) {
                const message = await interaction.editReply({
                    content: `${interaction.user}`,
                    embeds: [eEmbed],
                });

                setTimeout(() => {
                    message.delete();
                }, 9000);
            }

            throw error;
        }
    },
};
