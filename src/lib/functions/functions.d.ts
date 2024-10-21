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

// function to load evenrs
export type LoadEvents = (client: DiscordBot, dir: string) => Promise<void>;

// function to load commands
export type LoadCommands = (client: DiscordBot, dir: string) => Promise<void>;

// types for requesterTransformer function
export interface Requester {
  id: string;
  username: string;
  discriminator?: string;
  avatarURL?: string;
}
