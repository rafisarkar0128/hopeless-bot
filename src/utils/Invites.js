const { OAuth2Scopes } = require("discord.js");

class Invite {
  constructor(client) {
    /**
     * Base Client to use within this class
     * @type {import("@structures/BotClient.js")}
     */
    this.client = client;

    /**
     * Default permissions to use when creating invites
     * @type {import("discord.js").PermissionResolvable[]}
     */
    this.defaultPermissions = [
      "Administrator",
      "ViewAuditLog",
      "ManageGuild",
      "ManageRoles",
      "ManageChannels",
      "KickMembers",
      "BanMembers",
      "CreateInstantInvite",
      "ChangeNickname",
      "ManageNicknames",
      "ManageGuildExpressions",
      "CreateGuildExpressions",
      "ManageWebhooks",
      "ViewChannel",
      "ManageEvents",
      "CreateEvents",
      "ModerateMembers",
      "ViewGuildInsights",
      "ViewCreatorMonetizationAnalytics",
      "SendMessages",
      "CreatePublicThreads",
      "CreatePrivateThreads",
      "SendMessagesInThreads",
      "SendTTSMessages",
      "ManageMessages",
      "ManageThreads",
      "EmbedLinks",
      "AttachFiles",
      "ReadMessageHistory",
      "MentionEveryone",
      "UseExternalEmojis",
      "UseExternalStickers",
      "AddReactions",
      "UseApplicationCommands",
      "UseEmbeddedActivities",
      "UseExternalApps",
      "SendPolls",
      "Connect",
      "Speak",
      "Stream",
      "MuteMembers",
      "DeafenMembers",
      "MoveMembers",
      "UseVAD",
      "PrioritySpeaker",
      "RequestToSpeak",
      "UseSoundboard",
      "UseExternalSounds",
      "SendVoiceMessages",
    ];
  }

  /**
   * A function to generate invite links for the client
   * @param {import("discord.js").GuildResolvable} guild
   * @returns {string}
   */
  getBot(guild) {
    if (guild) {
      return this.client.generateInvite({
        guild: guild,
        disableGuildSelect: true,
        permissions: this.defaultPermissions,
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      });
    }
    return this.client.generateInvite({
      permissions: this.defaultPermissions,
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    });
  }

  /**
   * A function to create an invites for provided guildId
   * @param {import("discord.js").GuildResolvable} guildOrId
   * @param {import("discord.js").InviteCreateOptions} options
   * @returns {Promise<import("discord.js").Invite>}
   */
  async getGuild(guildOrId, options) {
    const guild = this.client.guilds.resolve(guildOrId) ?? this.client.guilds.cache.get(guildOrId);
    if (!guild) return;
    return await guild.invites.create(guild.systemChannel, {
      temporary: options.temporary ?? false,
      maxAge: options.maxAge ?? 604800,
      maxUses: options.maxUses ?? Infinity,
      unique: options.unique ?? false,
      reason: options.reason,
      targetApplication: options.targetApplication,
      targetUser: options.targetUser,
      targetType: options.targetType,
    });
  }
}

module.exports = Invite;
