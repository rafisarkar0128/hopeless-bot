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
  | "RANK"
  | "NONE"
  | "SOCIAL"
  | "SUGGESTION"
  | "TICKET"
  | "UTILITY";

export type SubCommand = {
  name: string;
  description: string;
};

// Base Command Structure
export interface BaseCommandStructure {
  data:
    | APIApplicationCommand
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder;
  ephemeral: boolean;
  cooldown: number;
  category: CommandCategory;
  usage: {
    prefix: string;
    slash: string;
  };
  aliases: string[];
  minArgsCount: number;
  isDisabled: boolean;
  isPrefixDisabled: booelan;
  isSlashDisabled: boolean;
  isPremium: boolean;
  isGlobal: boolean;
  isGuildOnly: boolean;
  isDevOnly: boolean;
  isVoiceChannelOnly: boolean;
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
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

// Command Structure
export interface CommandStructure {
  data: APIApplicationCommand | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  ephemeral: boolean;
  cooldown: number;
  category: CommandCategory;
  usage: {
    prefix: string;
    slash: string;
  };
  aliases: string[];
  minArgsCount: number;
  isDisabled: boolean;
  isPrefixDisabled: booelan;
  isSlashDisabled: boolean;
  isPremium: boolean;
  isGlobal: boolean;
  isGuildOnly: boolean;
  isDevOnly: boolean;
  isVoiceChannelOnly: boolean;
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
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
  ephemeral: boolean;
  cooldown: number;
  category: CommandCategory;
  isDisabled: boolaean;
  isPremium: boolean;
  isGlobal: boolean;
  isGuildOnly: boolean;
  isDevOnly: boolean;
  isVoiceChannelOnly: boolean;
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
}
