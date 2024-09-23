import { APIMessage } from "discord.js";

export type EventName =
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
export interface EventStructure {
    name: EventName;
    once: boolean;
    rest: boolean;
    execute: (
        client: import("./lib/DiscordBot").DiscordBot,
        ...args: any
    ) => Promise<any>;
}

export type CommandCategory =
    | "ADMIN"
    | "ANIME"
    | "AUTOMOD"
    | "ECONOMY"
    | "FUN"
    | "IMAGE"
    | "INFORMATION"
    | "INVITE"
    | "MODERATION"
    | "MUSIC"
    | "TEST"
    | "NONE"
    | "OWNER"
    | "SOCIAL"
    | "SUGGESTION"
    | "TICKET"
    | "UTILITY";
export interface CommandStructure {
    data: import("discord.js").SlashCommandBuilder;
    aliases?: string[];
    minArgsCount?: number;
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    botPermissions?: import("discord.js").PermissionResolvable[];
    userPermissions?: import("discord.js").PermissionResolvable[];
    run: (
        client: import("./lib/DiscordBot").DiscordBot,
        message: import("discord.js").Message,
        args: string[],
        data: Object,
    ) => Promise<any>;
    execute: (
        client: import("./lib/DiscordBot").DiscordBot,
        interaction: import("discord.js").ChatInputCommandInteraction,
        data: Object,
    ) => Promise<any>;
}

export type FileExtensions =
    | ".js"
    | ".jsx"
    | ".json"
    | ".cjs"
    | ".cts"
    | ".mjs"
    | ".mts"
    | ".ts "
    | ".tsx"
    | ".jpg"
    | ".png"
    | ".jpeg"
    | ".gif"
    | ".mp4"
    | ".mp3"
    | ".mkv";
export type LoadFiles = (dirname: string, ext: FileExtensions) => Promise<string[]>;

export type ErrorTypes =
    | "error"
    | "event"
    | "command"
    | "internal"
    | "external"
    | "player";
export type SendError = (
    error: Error,
    type: ErorTypes,
    data?: any,
) => Promise<void> | Error;

export type ContainsLink = (text: string) => boolean;
export type ContainsDiscordInvite = (text: string) => boolean;
export type GetRandomColor = () => string;
export type IsHex = (text: string) => boolean;
export type IsValidColor = (text: string) => boolean;

export type GetRandomInt = (max: number) => number;
export type DiffHours = (dt2: Date, dt1: Date) => Date;
export type Timeformat = (timeInSeconds: number) => string;
export type DurationToMillis = (duration: string) => number;
export type GetRemainingTime = (timeUntil: Date) => number;
export type ParsePermissions = (
    permissions: import("discord.js").PermissionResolvable[],
) => string;
