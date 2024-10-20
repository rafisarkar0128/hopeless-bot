import {
  CommandOptions,
  PrefixObjectStructure,
  SlashObjectStructure,
  ContextObjectStructure,
} from "./shared.d.ts";

// BaseCommandStructure to use in loadCommands and syncCommands function
export interface BaseCommandStructure {
  options: CommandOptions;
  prefix?: PrefixObjectStructure;
  slash?: SlashObjectStructure;
  context?: ContextObjectStructure;
}

// CommandStructure to use in command modules
export interface CommandStructure {
  options: CommandOptions;
  prefix?: PrefixObjectStructure;
  slash?: SlashObjectStructure;
}

// PrefixCommandStructure to use in prefix command collection
export interface PrefixCommandStructure {
  category?: CommandCategory;
  cooldown?: number;
  premium?: boolean;
  guildOnly?: boolean;
  devOnly?: boolean;
  voiceChannelOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  disabled?: boolean;
  minArgsCount?: number;
  subcommands: SubCommand[];
  execute: (
    client: DiscordBot,
    message: Message,
    args: string[],
    data: object,
  ) => Promise<any>;
}

// SlashCommandStructure to use in slash command collection
export interface SlashCommandStructure {
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  disabled?: boolean;
  minArgsCount?: number;
  subcommands: SubCommand[];
  execute: (client: DiscordBot, message: Message, args: string[], data: object) => {};
  data: APIApplicationCommand | ContextMenuCommandBuilder;
  ephemeral?: boolean;
  global?: boolean;
  disabled?: boolean;
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
}
