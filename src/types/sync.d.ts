import {
    LocalizationMap,
    ApplicationCommandOption,
    APIApplicationCommandOption,
    APIApplicationCommand,
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionChoiceData,
} from "discord.js";
import { DiscordBot } from "@lib/DiscordBot";

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

// Fucntion syncCommands() to synchronize Application Commands
export type SyncCommands = (
    client: DiscordBot,
    newCommands: NewCommand[],
) => Promise<void>;

// Fucntion fetchCommands() to fetch Application Commands
export type FetchCommands = (client: DiscordBot) => Promise<OldCommand[]>;

// Fucntion checkForChange() to check for changes in Application Command Data
export type CheckForChanges = (
    oldCommand: OldCommand,
    newCommand: NewCommand,
) => Promise<boolean>;

// Function CheckForChangeInNameLocalization() to check for changes in nameLocalizations
export type CheckForChangeInNameLocalization = (
    nameLocalizations: LocalizationMap,
    name_localizations: LocalizationMap,
) => Promise<boolean>;

// Function CheckForChangeInDescriptionLocalization() to check for changes in descriptionLocalizations
export type CheckForChangeInDescriptionLocalization = (
    descriptionLocalizations: LocalizationMap,
    description_localizations: LocalizationMap,
) => Promise<boolean>;

// Function checkForChangesinOptions() to check for changes in options;
export type CheckForChangesinOptions = (
    oldOptions: ApplicationCommandOption[],
    newOptions: APIApplicationCommandOption[],
) => Promise<boolean>;

// Function CheckForChangeInChoices() to check for changes in choices;
export type CheckForChangeInChoices = (
    oldChoices: ApplicationCommandOptionChoiceData[],
    newChoices: APIApplicationCommandOptionChoice[],
) => Promise<boolean>;
