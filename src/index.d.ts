import {
    APIMessage,
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    ChatInputCommandInteraction,
} from "discord.js";

// Discord.JS Event Names
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

// Base Event Module Structure
export interface EventStructure {
    name: EventName;
    once: boolean;
    rest: boolean;
    execute: (
        client: import("./lib/DiscordBot").DiscordBot,
        ...args: any
    ) => Promise<any>;
}

// Command Categories
export type CommandCategory =
    | "ADMIN"
    | "ANIME"
    | "AUTOMOD"
    | "CONFIG"
    | "DEVELOPMENT"
    | "ECONOMY"
    | "FUN"
    | "IMAGE"
    | "INFORMATION"
    | "INVITE"
    | "MODERATION"
    | "MUSIC"
    | "NONE"
    | "SOCIAL"
    | "SUGGESTION"
    | "TEST"
    | "TICKET"
    | "UTILITY";

// Base Command Structure
export interface CommandStructure {
    data: import("discord.js").SlashCommandBuilder;
    aliases?: string[];
    minArgsCount?: number;
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    disabled?: boolean;
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
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

// File Exentions
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

// Function loadFiles()
export type LoadFiles = (dirname: string, ext: FileExtensions) => Promise<string[]>;

// Error Types
export type ErrorTypes =
    | "error"
    | "event"
    | "command"
    | "internal"
    | "external"
    | "player"
    | "fetch";

// Function sendError() to send error messages
export type SendError = (
    error: Error,
    type: ErrorTypes,
    data?: any,
) => Promise<void> | Error;

// Type definations for Utils Class
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
export type OnCoolDown = (
    interaction: ChatInputCommandInteraction,
    command: CommandStructure,
) => promise<boolean | number>;

// Fucntion syncCommands() to synchronize Application Commands
export type SyncCommands = (
    client: import("@lib/DiscordBot").DiscordBot,
    Commands: {
        globalCommands: ApplicationCommandDataResolvable[];
        guildCommands: ApplicationCommandDataResolvable[];
    },
) => Promise<void>;

// Fucntion fetchCommands() to fetch Application Commands
export type FetchCommands = (client: import("@lib/DiscordBot").DiscordBot) => Promise<{
    GlobalCommands: ApplicationCommandData[];
    GuildCommands: ApplicationCommandData[];
}>;

//
export type CheckForChanges = (
    newCommands: ApplicationCommandDataResolvable[],
    oldCommands: ApplicationCommandData[],
) => Promise<void>;
