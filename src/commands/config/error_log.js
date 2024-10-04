const {
    SlashCommandBuilder,
    InteractionContextType,
    ApplicationIntegrationType,
    ChannelType,
} = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("error-log")
        .setDescription("Config the error logging system for the bot")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
            option
                .setName("create")
                .setDescription("Create a new error logging system")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to mark as log channel")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true),
                ),
        )
        .addSubcommand((option) =>
            option.setName("delete").setDescription("Delete the error logging system"),
        )
        .addSubcommand((option) =>
            option.setName("preview").setDescription("Test the error logging system"),
        )
        .addSubcommandGroup((option) =>
            option
                .setName("update")
                .setDescription("Update the error logging system")
                .addSubcommand((option) =>
                    option
                        .setName("channel")
                        .setDescription("Update the log channel of error logging system")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to mark as log channel")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true),
                        ),
                )
                .addSubcommand((option) =>
                    option
                        .setName("categories")
                        .setDescription("Update categories of the error logging system")
                        .addStringOption((option) =>
                            option
                                .setName("categories")
                                .setDescription("Select a category to update")
                                .addChoices([
                                    {
                                        name: "INTERACTIONS",
                                        value: "interactions",
                                    },
                                    {
                                        name: "MESSAGES",
                                        value: "messages",
                                    },
                                    {
                                        name: "EVENTS",
                                        value: "events",
                                    },
                                    {
                                        name: "INTERNAL",
                                        value: "internal",
                                    },
                                    {
                                        name: "EXTERNAL",
                                        value: "external",
                                    },
                                    {
                                        name: "PLAYER",
                                        value: "player",
                                    },
                                ])
                                .setRequired(true),
                        )
                        .addBooleanOption((option) =>
                            option
                                .setName("enable")
                                .setDescription("Enable or disable the category")
                                .setRequired(true),
                        ),
                ),
        ),
    aliases: ["errlog", "elog", "error", "logger"],
    minArgsCount: 0,
    usage: "/error-log [subcommand | subcommand group] | {prefix}error-log [subcommand] (args)",
    cooldown: 0,
    category: "CONFIG",
    premium: false,
    disabled: { slash: false, prefix: false },
    global: false,
    guildOnly: true,
    devOnly: true,
    botPermissions: ["ManageChannels", "ManageGuild"],
    userPermissions: ["Administrator"],
    run: async (client, message, args, data) => {
        message.reply({
            content: "**__Still in testing phase__**",
        });
    },
    execute: async (client, interaction, data) => {
        const channel = interaction.options.getChannel("channel");
        const doc = await errorlog.findOne({
            Enabled: "true",
        });

        if (!channel && !doc) {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.wrong)
                        .setDescription(
                            "❌ **As there is no error message logging system and no channel has been provided so I am going to do nothing.**",
                        ),
                ],
            });
        }

        if (!channel && doc) {
            await errorlog.findOneAndDelete({
                Enabled: "true",
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.wrong)
                        .setDescription(
                            "**❌ As no channel has been provided so I have disabled the error message logging system.**",
                        ),
                ],
            });
        }

        if (channel && !doc) {
            await errorlog.create({
                Channel: channel.id,
                Enabled: "true",
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.good)
                        .setDescription(
                            `**✅ Successfully enabled the error message logging system. <#${channel.id}> | This channel has been set to log error messages.**`,
                        ),
                ],
            });
        }

        if (channel && doc) {
            await errorlog.findOneAndUpdate(
                {
                    Enabled: "true",
                },
                {
                    Channel: channel.id,
                },
            );
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.good)
                        .setDescription(
                            `**✅ Successfully updated error message logging utility. <#${channel.id}> | This channel has been set to log error messages.**`,
                        ),
                ],
            });
        }

        //interaction.reply({
        //    content: "**__Still in testing phase__**",
        //    ephemeral: true,
        //});
    },
};

/*
const channel = interaction.options.getChannel("channel");
const doc = await errorlog.findOne({
    Enabled: "true",
});

if (!channel && !doc) {
    return interaction.reply({
        ephemeral: true,
        embeds: [
            new EmbedBuilder()
                .setColor(client.colors.wrong)
                .setDescription(
                    "❌ **As there is no error message logging system and no channel has been provided so I am going to do nothing.**",
                ),
        ],
    });
}

if (!channel && doc) {
    await errorlog.findOneAndDelete({
        Enabled: "true",
    });
    return interaction.reply({
        ephemeral: true,
        embeds: [
            new EmbedBuilder()
                .setColor(client.colors.wrong)
                .setDescription(
                    "**❌ As no channel has been provided so I have disabled the error message logging system.**",
                ),
        ],
    });
}

if (channel && !doc) {
    await errorlog.create({
        Channel: channel.id,
        Enabled: "true",
    });
    return interaction.reply({
        ephemeral: true,
        embeds: [
            new EmbedBuilder()
                .setColor(client.colors.good)
                .setDescription(
                    `**✅ Successfully enabled the error message logging system. <#${channel.id}> | This channel has been set to log error messages.**`,
                ),
        ],
    });
}

if (channel && doc) {
    await errorlog.findOneAndUpdate(
        {
            Enabled: "true",
        },
        {
            Channel: channel.id,
        },
    );
    return interaction.reply({
        ephemeral: true,
        embeds: [
            new EmbedBuilder()
                .setColor(client.colors.good)
                .setDescription(
                    `**✅ Successfully updated error message logging utility. <#${channel.id}> | This channel has been set to log error messages.**`,
                ),
        ],
    });
}
*/
