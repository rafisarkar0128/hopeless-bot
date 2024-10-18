import {
  ContextMenuCommandBuilder,
  PermissionResolvable,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandOptions, ContextStructure } from "./shared";

// contextmenu command structure
export interface ContextMenuStructure {
  options: CommandOptions;
  context: ContextStructure;
}
