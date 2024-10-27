// Error Types
export type ErrorTypes =
  | "error"
  | "event"
  | "command"
  | "internal"
  | "external"
  | "player"
  | "fetch";

// Function sendError() to send error messages
export type SendError = (error: Error, type: ErrorTypes, data?: any) => Promise<void>;

// Type definations for Utils Class
export type ContainsLink = (text: string) => boolean;
export type ContainsDiscordInvite = (text: string) => boolean;
export type GetRandomColor = () => string;
export type IsHex = (text: string) => boolean;
export type IsValidColor = (text: string) => boolean;
export type GetRandomInt = (max: number) => number;
export type DiffHours = (dt2: Date, dt1: Date) => Date;
export type Timeformat = (timeInSeconds: number) => string;
export type DurationToMillis = (duration: string) => number;
export type ParsePermissions = (permissions: PermissionResolvable[]) => string;

export type Color =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "bgBlack"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan"
  | "bgWhite";

export type GetTableBorder = (color: Color) => object;
