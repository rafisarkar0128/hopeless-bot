import {
    APIApplicationCommand,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    Message,
    MessageContextMenuCommandInteraction,
    PermissionResolvable,
    SlashCommandBuilder,
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

// Base Application Command Structure
export interface BaseCommandStructure {
    data: APIApplicationCommand;
    aliases?: string[];
    minArgsCount?: number;
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    disabled?: boolean | { slash: boolean; prefix: boolean };
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    inVoice: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    run: (client: DiscordBot, message: Message, args: string[]) => Promise<any>;
    execute: (
        client: DiscordBot,
        interaction: ChatInputCommandInteraction,
    ) => Promise<any>;
}

// Base Command Structure
export interface CommandStructure {
    data: SlashCommandBuilder;
    aliases?: string[];
    minArgsCount?: number;
    usage?: string;
    cooldown: number;
    category: CommandCategory;
    premium?: boolean;
    disabled?: boolean | { slash: boolean; prefix: boolean };
    global?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
    inVoice: boolean;
    botPermissions: PermissionResolvable[];
    userPermissions: PermissionResolvable[];
    run: (client: DiscordBot, message: Message, args: string[]) => Promise<any>;
    execute: (
        client: DiscordBot,
        interaction: ChatInputCommandInteraction,
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
