import {
    APIApplicationCommand,
    ApplicationCommand,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    Message,
    MessageContextMenuCommandInteraction,
    PermissionResolvable,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { DiscordBot } from "@lib/DiscordBot";

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
export interface BaseCommandStructure {
    data: APIApplicationCommand;
    aliases?: string[];
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    disabled?: boolean;
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    inVoiceChannel: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    run: (client: DiscordBot, message: Message, args: string[]) => Promise<any>;
    execute: (
        client: DiscordBot,
        interaction: ChatInputCommandInteraction,
    ) => Promise<any>;
}

// Command Structure
export interface CommandStructure {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    aliases?: string[];
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    disabled?: boolean;
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    inVoiceChannel: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    run: (client: DiscordBot, message: Message, args: string[]) => Promise<any>;
    execute: (
        client: DiscordBot,
        interaction: ChatInputCommandInteraction,
    ) => Promise<any>;
}

// ContextMenu Structure
export interface ContextMenuStructure {
    data: ContextMenuCommandBuilder;
    cooldown: number;
    category: CommandCategory;
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
    ) => Promise<any>;
}

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
