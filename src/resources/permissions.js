// Permission names for validation
const Permissions = [
  // General Guild Permissions
  "ViewChannel",
  "ManageChannels",
  "ManageRoles",
  "CreateGuildExpressions",
  "ManageGuildExpressions",
  "ViewAuditLog",
  "ViewGuildInsights",
  "ManageWebhooks",
  "ManageGuild",

  // Member Permissions
  "CreateInstantInvite",
  "ChangeNickname",
  "ManageNicknames",
  "KickMembers",
  "BanMembers",
  "ModerateMembers",

  // Text Channel Permissions
  "SendMessages",
  "SendMessagesInThreads",
  "CreatePublicThreads",
  "CreatePrivateThreads",
  "EmbedLinks",
  "AttachFiles",
  "AddReactions",
  "UseExternalEmojis",
  "UseExternalStickers",
  "MentionEveryone",
  "ManageMessages",
  "ManageThreads",
  "ReadMessageHistory",
  "SendTTSMessages",
  "SendVoiceMessages",
  "SendPolls",

  // Voice Channel Permissions
  "Connect",
  "Speak",
  "Stream",
  "UseSoundboard",
  "UseExternalSounds",
  "UseVAD",
  "PrioritySpeaker",
  "MuteMembers",
  "DeafenMembers",
  "MoveMembers",
  "SetVoiceChannelStatus",

  // App Permissions
  "UseApplicationCommands",
  "UseEmbeddedActivities",
  "UseExternalApps",

  // Stage Channel Permissions
  "RequestToSpeak",

  // Guild Event Permissions
  "CreateEvents",
  "ManageEvents",

  // Monitization Permissions
  "ViewCreatorMonetizationAnalytics",

  // Advance Permissions
  "Administrator",
];

module.exports = { Permissions };
