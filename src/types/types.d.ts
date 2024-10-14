import { APIApplicationCommand } from "discord.js";

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
