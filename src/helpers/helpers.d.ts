import { DiscordBot } from "@lib/DiscordBot";

type FileExtensions =
  | ".js"
  | ".jsx"
  | ".ts"
  | ".tsx"
  | ".cjs"
  | ".cts"
  | ".mjs"
  | ".mts"
  | ".json"
  | ".jpg"
  | ".jpeg"
  | ".png"
  | ".gif"
  | ".mpeg"
  | ".mp4"
  | ".mp3"
  | ".mkv"
  | ".ogg";

export type LoadFiles = (
  path: string,
  ext?: FileExtensions[] | string[],
) => Promise<string[]> | Promise<[]>;
export type LoadEvents = (client: DiscordBot, dir: string) => Promise<void>;
export type LoadCommands = (client: DiscordBot, dir: string) => Promise<void>;
export type LoadLocales = (client: DiscordBot) => void;
export type GetDefaultLocale = (client: DiscordBot) => string;
export type LogVanity = (client: DiscordBot) => void;
export type ConnectDB = (client: DiscordBot) => void;
