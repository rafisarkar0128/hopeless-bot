import { Collection } from "discord.js";
import { BaseEventStructure } from "./events";
import { BaseCommandStructure, ContextMenuStructure } from "./commands";

// Collection Types
export type TimestampCollection = Collection<string, Date>;
export type EventCollection = Collection<string, BaseEventStructure>;
export type CommandCollection = Collection<string, BaseCommandStructure>;
export type AliasCollection = Collection<string, string>;
export type CoolDownCollection = Collection<string, TimestampCollection>;
export type ContextCollection = Collection<string, ContextMenuStructure>;
