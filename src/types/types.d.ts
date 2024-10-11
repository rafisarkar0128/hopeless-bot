// Command Types
export type NewCommand = {
  data: APIApplicationCommand;
  global: Boolean;
  enabled: boolean;
};
export type OldCommand = {
  data: ApplicationCommand;
  global: Boolean;
};
