// types for functions that will be used in DiscordBot class

import { DiscordBot } from "@lib/DiscordBot";

// some extension exaple
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

// function to load files recursively
export type LoadFiles = (
  path: string,
  ext?: FileExtensions[] | string[],
) => Promise<string[]> | Promise<[]>;

export type LoadEvents = (client: DiscordBot, dir: string) => Promise<void>;
