import {
  CommandOptions,
  PrefixCommandStructure,
  SlashCommandStructure,
  ContextStructure,
} from "./shared";

// BaseCommandStructure to use in loadCommands and syncCommands function
export interface BaseCommandStructure {
  options: CommandOptions;
  prefix?: PrefixCommandStructure;
  slash?: SlashCommandStructure;
  context?: ContextStructure;
}

// CommandStructure to use in command modules
export interface CommandStructure {
  options: CommandOptions;
  prefix: PrefixCommandStructure;
  slash: SlashCommandStructure;
}
