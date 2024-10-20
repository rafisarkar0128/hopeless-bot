// shared types to use in base structures

import {
  APIApplicationCommand,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { DiscordBot } from "@lib/DiscordBot.js";

// CommandCategories to use in CommandStructure and ContextMenuStructure
type CommandCategory =
  | "admin"
  | "anime"
  | "automod"
  | "config"
  | "development"
  | "economy"
  | "fun"
  | "image"
  | "information"
  | "invite"
  | "moderation"
  | "music"
  | "rank"
  | "none"
  | "social"
  | "suggestion"
  | "ticket"
  | "utility";

// SubComamnd to use in PrefixCommandStructure
type SubCommand = {
  name: string;
  description: string;
};

// CommandOptions to use in CommandStructure and ContextMenuStructure
export type CommandOptions = {
  category?: CommandCategory;
  cooldown?: number;
  premium?: boolean;
  guildOnly?: boolean;
  devOnly?: boolean;
  voiceChannelOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
};

// PrefixCommandStructure to use in CommandStructure
export type PrefixObjectStructure = {
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  disabled?: boolean;
  minArgsCount?: number;
  subcommands: SubCommand[];
  execute: (client: DiscordBot, message: Message, args: string[], data: object) => {};
};

// SlashCommandStructure to use in CommandStructure
export type SlashObjectStructure = {
  data: APIApplicationCommand | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  ephemeral?: boolean;
  usage?: string;
  global?: boolean;
  disabled?: boolean;
  execute: (
    client: DiscordBot,
    interaction: ChatInputCommandInteraction,
    data: object,
  ) => Promise<any>;
};

// ContextStructure to use in ContextMenuStructure
export type ContextObjectStructure = {
  data: APIApplicationCommand | ContextMenuCommandBuilder;
  ephemeral?: boolean;
  global?: boolean;
  disabled?: boolean;
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
};
