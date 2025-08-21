const { EmbedBuilder } = require("discord.js");

module.exports = class Logs {
  constructor(client) {
    /**
     * @type {import("@structures/BotClient.js")}
     */
    this.client = client;

    /**
     * @typedef {object} LogsType
     * @property {{color: string, webhook: ?string, channel: ?string}} general
     * @property {{color: string, webhook: ?string, channel: ?string}} error
     * @property {{color: string, webhook: ?string, channel: ?string}} command
     */

    /**
     * @type {LogsType}
     */
    this.logs = client.config.logs;
  }

  /**
   * A function to generate an embed from an error
   * @param {any} error
   * @returns {import("discord.js").EmbedBuilder}
   * @private
   */
  errorEmbed(error) {
    if (error instanceof EmbedBuilder) return error;
    const ErrorEmbed = new EmbedBuilder().setColor(this.logs.error.color);

    if (error instanceof Error && error.stack) {
      ErrorEmbed.setDescription(
        `\`\`\`\n${error.stack.length > 3992 ? error.stack.substring(0, 3989) + "..." : error.stack}\n\`\`\``
      );
      return ErrorEmbed;
    }

    if (typeof error === "object") {
      let message = "";
      for (const [key, value] of Object.entries(error)) {
        message += `${key}: ${value}\n`;
      }
      ErrorEmbed.setDescription(
        `\`\`\`\n${message.length > 3992 ? message.substring(0, 3989) + "..." : message}\n\`\`\``
      );
      return ErrorEmbed;
    }

    if (typeof error === "string") {
      ErrorEmbed.setDescription(
        `\`\`\`\n${error.length > 3992 ? error.substring(0, 3989) + "..." : error}\n\`\`\``
      );
      return ErrorEmbed;
    }
  }

  /**
   * A function to generate an embed from payload
   * @param {any} payload
   * @returns {import("discord.js").EmbedBuilder}
   * @private
   */
  generalEmbed(payload) {
    if (payload instanceof EmbedBuilder) return payload;
    const Embed = new EmbedBuilder().setColor(this.logs.general.color);

    if (typeof payload === "string") {
      Embed.setDescription(
        `\`\`\`\n${payload.length > 3992 ? payload.substring(0, 3989) + "..." : payload}\n\`\`\``
      );
      return Embed;
    }
    if (typeof payload === "object") {
      let string = "";
      for (const [k, v] of Object.entries(payload)) {
        string += `${k}: ${v}\n`;
      }
      Embed.setDescription(
        `\`\`\`\n{\n${string.length > 3988 ? string.substring(0, 3985) + "..." : string}}\n\n\`\`\``
      );
      return Embed;
    }
  }

  /**
   * @typedef {object} CommandPayload
   * @property {import("discord.js").Interaction} interaction
   * @property {import("@types/index.d.ts").CommandStructure} command
   */

  /**
   * A function to generate an embed from payload
   * @param {CommandPayload} payload
   * @returns {import("discord.js").EmbedBuilder}
   * @private
   */
  commandEmbed(payload) {
    if (payload instanceof EmbedBuilder) return payload;
    const { interaction, command } = payload;
    const Embed = new EmbedBuilder()
      .setColor(this.logs.command.color)
      .setAuthor({
        name: `Command Logs`,
        iconURL: this.client.user.avatarURL({ extension: "png" }),
      })
      .setFields([
        {
          name: "Command",
          value: `\`${command.name}\``,
          inline: true,
        },
        {
          name: "User",
          value: `${interaction.user.username}\n(\`${interaction.user.id}\`)`,
          inline: true,
        },
        {
          name: "Guild",
          value: `${interaction.guild.name}\n(\`${interaction.guild.id}\`)`,
          inline: true,
        },
      ]);
    return Embed;
  }

  /**
   * @typedef {object} ErrorData
   * @property {"general"|"error"|"command"} type
   */

  /**
   * A function to send errors to discord
   * @param {any} payload
   * @param {ErrorData} data
   * @returns {Promise<void>}
   */
  async send(payload, data) {
    if (!payload || !data) return;
    const { type } = data;
    const channelId = this.logs[type].channel;
    let embed = undefined;
    switch (type) {
      case "error": {
        embed = this.errorEmbed(payload);
        break;
      }
      case "general": {
        embed = this.generalEmbed(payload);
        break;
      }
      case "command": {
        embed = this.commandEmbed(payload);
        break;
      }
    }
    /** @type {import("discord.js").GuildTextBasedChannel} */
    const channel = this.client.channels.cache.get(channelId);
    if (channel) await channel.send({ embeds: [embed] }).catch(() => null);
  }
};
