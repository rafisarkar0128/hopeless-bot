import {
  APIApplicationCommand,
  ContextMenuCommandBuilder,
  PermissionResolvable,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { DiscordBot } from "@lib/DiscordBot.js";
import { CommandCategory } from "./shared.d.ts";

// CommandStructure to use in both contextmenu collection and contextmenu modules
export interface ContextMenuStructure {
  category?: CommandCategory;
  cooldown?: number;
  premium?: boolean;
  guildOnly?: boolean;
  devOnly?: boolean;
  voiceChannelOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
  data: APIApplicationCommand;
  ephemeral?: boolean;
  global?: boolean;
  disabled?: boolean;
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
}
