const {
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
} = require("discord.js");

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
                interaction.reply({
                    content: "This command isn't available.",
                    ephemeral: true,
                });
                return client.application.commands.delete(
                    interaction.commandName
                );
            }

            return command.execute(client, interaction);
        } catch (error) {
            if (interaction.deferred || interaction.replied) {
                interaction.editReply({
                    content: `An error occured while executing the command.`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: `An error occured while executing the command.`,
                    ephemeral: true,
                });
            }

            return client.log(error, "error");
        }
    },
};
