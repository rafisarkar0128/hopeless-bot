// File Exentions
export type FileExtensions =
    | ".js"
    | ".jsx"
    | ".json"
    | ".cjs"
    | ".cts"
    | ".mjs"
    | ".mts"
    | ".ts "
    | ".tsx"
    | ".jpg"
    | ".png"
    | ".jpeg"
    | ".gif"
    | ".mp4"
    | ".mp3"
    | ".mkv";

// Function loadFiles()
export type LoadFiles = (dirname: string, ext: FileExtensions) => Promise<string[]>;

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
export type GetRemainingTime = (
    timestamps: TimestampCollection,
    cooldown: number,
    userId: string,
) => promise<boolean | number>;
