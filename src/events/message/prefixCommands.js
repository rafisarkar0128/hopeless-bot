const { Message, EmbedBuilder } = require("discord.js");

/** @type {import("@src/index").EventStructure} */
module.exports = {
    name: "messageCreate",
    once: false,
    rest: false,
    /** @param {Message} message */
    execute: async (client, message) => {
        if (message.author.bot) return;

        const { config, colors, commands, aliases, utils } = client;
        const { author, member, guild, channel } = message;

        const default_prefix = config.bot.defaultPrefix;
        if (!message.content.startsWith(default_prefix)) return;
        if (!member && guild) member = guild.fetchMember(message);

        try {
            const args = message.content.slice(default_prefix.length).trim().split(/ +/g);
            const commandName = args.shift().toLowerCase();
            const command =
                commands.get(commandName) || commands.get(aliases.get(commandName));

            console.log(commandName);

            const mEmbed = new EmbedBuilder()
                .setTitle("**This command isn't available. Try again after sometime.**")
                .setColor(colors.Wrong);
            if (!command) {
                return message.reply({
                    embeds: [mEmbed],
                });
            }

            const dEmbed = new EmbedBuilder()
                .setTitle("**This command is disabled by the __Owner__ or __Devs__**.")
                .setColor(colors.Wrong);
            if (command.disabled.prefix && !config.devs.includes(author.id)) {
                return message.reply({
                    embeds: [dEmbed],
                });
            }

            const dvEmbed = new EmbedBuilder()
                .setTitle(
                    `**Only the owner or developers are allowed to use this command.**`,
                )
                .setColor(colors.Wrong);
            if (
                (command.devOnly || command.category === "DEVELOPMENT") &&
                !config.devs.includes(author.id)
            ) {
                return message.reply({
                    embeds: [dvEmbed],
                });
            }

            const gEmbed = new EmbedBuilder()
                .setTitle(
                    `**This command can only be used in a __Guild (Discord Server)__**`,
                )
                .setColor(colors.Wrong);
            if (command.guildOnly && !message.inGuild()) {
                return message.reply({
                    embeds: [gEmbed],
                });
            }

            const timestamps = client.cooldowns.get(command.data.name);
            const cooldown = (command.cooldown || 3) * 1000;
            const remainingTime = utils.getRemainingTime(timestamps, cooldown, author.id);
            const cdEmbed = new EmbedBuilder()
                .setTitle(
                    `**Chill! Embed in on cooldown wait for \`${remainingTime}\` seconds**`,
                )
                .setColor(colors.Wrong);
            if (remainingTime && !config.devs.includes(author.id)) {
                return message.reply({
                    embeds: [cdEmbed],
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
                return message.reply({
                    embeds: [uPermission],
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
                return message.reply({
                    embeds: [bPermission],
                });
            }

            const vcEmbed = new EmbedBuilder()
                .setTitle(
                    `**You must have to be in a voice channel to use this command.**`,
                )
                .setColor(colors.Wrong);
            if (command.inVoiceChannel && !message.member.voice.channel) {
                return message.reply({
                    embeds: [vcEmbed],
                });
            }

            return command.run(client, message, args);
        } catch (error) {
            const eEmbed = new EmbedBuilder()
                .setColor(colors.StandBy)
                .setTitle(`** An error has occurred! Try again later!**`);

            const reply = await message.reply({
                content: `${author}`,
                embeds: [eEmbed],
            });
            setTimeout(() => {
                reply.delete();
            }, 9000);

            throw error;
        }
    },
};

