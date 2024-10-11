import {
  APIApplicationCommand,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  MessageContextMenuCommandInteraction,
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

export type SubCommand = {
  name: string;
  description: string;
};

// Command Structure
export interface CommandStructure {
  name: string;
  description: string;
  cooldown: number;
  category: CommandCategory;
  isPremium: boolean;
  isGlobal: boolean;
  isGuildOnly: boolean;
  isDevOnly: boolean;
  isVCOnly: boolean;
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
  prefixCommand: {
    enabled: boolean;
    aliases: string[];
    usage: string;
    minArgsCount: number;
    subcommands: SubCommand[];
  };
  slashCommand: {
    enabled: boolean;
    ephemeral: boolean;
    usage: string;
    data: APIApplicationCommand | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  };
  run: (
    client: DiscordBot,
    message: Message,
    args: string[],
    data: object,
  ) => Promise<any>;
  execute: (
    client: DiscordBot,
    interaction: ChatInputCommandInteraction,
    data: object,
  ) => Promise<any>;
}

// ContextMenu Structure
export interface ContextMenuStructure {
  data: ContextMenuCommandBuilder;
  enabled: boolean;
  ephemeral: boolean;
  cooldown: number;
  category: CommandCategory;
  isPremium: boolean;
  isGlobal: boolean;
  isGuildOnly: boolean;
  isDevOnly: boolean;
  isVCOnly: boolean;
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
}
