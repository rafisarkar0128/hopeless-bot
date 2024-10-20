import {
  ContextMenuCommandBuilder,
  PermissionResolvable,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandOptions, ContextStructure } from "./shared.d.ts";

// CommandStructure to use in both contextmenu collection and contextmenu modules
export interface ContextMenuStructure {
  options: CommandOptions;
  context: ContextStructure;
}
