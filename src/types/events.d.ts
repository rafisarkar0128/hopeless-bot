import { DiscordBot } from "@lib/DiscordBot";

// Base Event Structure
export interface BaseEventStructure {
    name: string;
    once: boolean;
    rest: boolean;
    ws: boolean;
    moonlink: boolean;
    execute: (client: DiscordBot, ...args: any) => Promise<any>;
}

// Discord.JS Event Names
export type DiscordEventNames =
    | "applicationCommandPermissionsUpdate"
    | "autoModerationActionExecution"
    | "autoModerationRuleCreate"
    | "autoModerationRuleDelete"
    | "autoModerationRuleUpdate"
    | "cacheSweep"
    | "channelCreate"
    | "channelDelete"
    | "channelPinsUpdate"
    | "channelUpdate"
    | "debug"
    | "entitlementCreate"
    | "entitlementDelete"
    | "entitlementUpdate"
    | "emojiCreate"
    | "emojiDelete"
    | "emojiUpdate"
    | "error"
    | "guildAuditLogEntryCreate"
    | "guildAvailable"
    | "guildBanAdd"
    | "guildBanRemove"
    | "guildCreate"
    | "guildDelete"
    | "guildIntegrationsUpdate"
    | "guildMemberAdd"
    | "guildMemberAvailable"
    | "guildMemberRemove"
    | "guildMembersChunk"
    | "guildMemberUpdate"
    | "guildScheduledEventCreate"
    | "guildScheduledEventDelete"
    | "guildScheduledEventUpdate"
    | "guildScheduledEventUserAdd"
    | "guildScheduledEventUserRemove"
    | "guildUnavailable"
    | "guildUpdate"
    | "interactionCreate"
    | "invalidated"
    | "inviteCreate"
    | "inviteDelete"
    | "messageCreate"
    | "messageDelete"
    | "messageDeleteBulk"
    | "messageReactionAdd"
    | "messageReactionRemove"
    | "messageReactionRemoveAll"
    | "messageReactionRemoveEmoji"
    | "messageUpdate"
    | "presenceUpdate"
    | "raw"
    | "ready"
    | "roleCreate"
    | "roleDelete"
    | "roleUpdate"
    | "shardDisconnect"
    | "shardError"
    | "shardReady"
    | "shardReconnecting"
    | "shardResume"
    | "stageInstanceCreate"
    | "stageInstanceDelete"
    | "stageInstanceUpdate"
    | "stickerCreate"
    | "stickerDelete"
    | "stickerUpdate"
    | "threadCreate"
    | "threadDelete"
    | "threadListSync"
    | "threadMembersUpdate"
    | "threadMemberUpdate"
    | "threadUpdate"
    | "typingStart"
    | "userUpdate"
    | "voiceServerUpdate"
    | "voiceStateUpdate"
    | "warn"
    | "webhooksUpdate"
    | "webhookUpdate";

// Base Event Module Structure
export interface DiscordEventStructure {
    name: DiscordEventNames;
    once: boolean;
    rest: boolean;
    ws: boolean;
    execute: (client: DiscordBot, ...args: any) => Promise<any>;
}

// Moonlink Client Events
export type MoonlinkEventNames =
    | "autoLeaved"
    | "debug"
    | "nodeClose"
    | "nodeCreate"
    | "nodeDestroy"
    | "nodeError"
    | "nodeRaw"
    | "nodeReconnect"
    | "playerCreated"
    | "playerDisconnect"
    | "playerMove"
    | "playerResume"
    | "queueEnd"
    | "socketClosed"
    | "trackEnd"
    | "trackError"
    | "trackStart"
    | "trackStuck";

// Base Moonlink Event Structure
export interface MoonlinkEventStructure {
    name: MoonlinkEventNames;
    moonlink: boolean;
    execute: (client: DiscordBot, ...args: any) => Promise<any>;
}
