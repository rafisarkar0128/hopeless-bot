import {
    APIMessage,
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    ChatInputCommandInteraction,
    ermissionResolvable,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    PermissionResolvable,
    Message,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    BaseApplicationCommandData,
    LocalizationMap,
    ApplicationCommandOption,
    ApplicationCommandOptionData,
    APIApplicationCommandOption,
    APIApplicationCommand,
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionChoiceData,
    Collection,
} from "discord.js";
import { DiscordBot } from "@lib/DiscordBot";

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
    execute: (client: DiscordBot, ...args: any) => Promise<any>;
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
    data: SlashCommandBuilder;
    aliases?: string[];
    minArgsCount?: number;
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    disabled?: { slash: boolean; prefix: boolean };
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    run: (
        client: DiscordBot,
        message: Message,
        args: string[],
        data: Object,
    ) => Promise<any>;
    execute: (
        client: DiscordBot,
        interaction: ChatInputCommandInteraction,
        data: Object,
    ) => Promise<any>;
}

// Base ContextMenu Structure
export interface ContextMenuStructure {
    data: ContextMenuCommandBuilder;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    disabled?: boolean;
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    execute: (
        client: DiscordBot,
        interaction:
            | MessageContextMenuCommandInteraction
            | UserContextMenuCommandInteraction,
        data: Object,
    ) => Promise<any>;
}

// Collection Types
export type TimestampCollection = Collection<string, date>;
export type EventCollection = Collection<string, EventStructure>;
export type CommandCollection = Collection<string, CommandStructure>;
export type AliasCollection = Collection<string, string>;
export type CooldownCollection = Collection<string, TimestampCollection>;
export type ContextCollection = Collection<string, ContextMenuStructure>;

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
export type SendError = (error: Error, type: ErrorTypes, data?: any) => Promise<void>;

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
export type ParsePermissions = (permissions: PermissionResolvable[]) => string;
export type GetRemainingTime = (
    timestamps: TimestampCollection,
    cooldown: number,
    userId: string,
) => promise<boolean | number>;

// Command Types
export type NewCommand = {
    data: APIApplicationCommand;
    global: Boolean;
    disabled: boolean;
};
export type OldCommand = {
    data: ApplicationCommand;
    global: Boolean;
};

// Fucntion syncCommands() to synchronize Application Commands
export type SyncCommands = (
    client: DiscordBot,
    newCommands: NewCommand[],
) => Promise<void>;

// Fucntion fetchCommands() to fetch Application Commands
export type FetchCommands = (client: DiscordBot) => Promise<OldCommand[]>;

// Fucntion checkForChange() to check for changes in Application Command Data
export type CheckForChanges = (
    oldCommand: OldCommand,
    newCommand: NewCommand,
) => Promise<boolean>;

// Function CheckForChangeInNameLocalization() to check for changes in nameLocalizations
export type CheckForChangeInNameLocalization = (
    nameLocalizations: LocalizationMap,
    name_localizations: LocalizationMap,
) => Promise<boolean>;

// Function CheckForChangeInDescriptionLocalization() to check for changes in descriptionLocalizations
export type CheckForChangeInDescriptionLocalization = (
    descriptionLocalizations: LocalizationMap,
    description_localizations: LocalizationMap,
) => Promise<boolean>;

// Function checkForChangesinOptions() to check for changes in options;
export type CheckForChangesinOptions = (
    oldOptions: ApplicationCommandOption[],
    newOptions: APIApplicationCommandOption[],
) => Promise<boolean>;

// Function CheckForChangeInChoices() to check for changes in choices;
export type CheckForChangeInChoices = (
    oldChoices: ApplicationCommandOptionChoiceData[],
    newChoices: APIApplicationCommandOptionChoice[],
) => Promise<boolean>;
