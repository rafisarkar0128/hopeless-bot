const { ApplicationCommandType, Locale } = require("discord.js");

/**
 * A function to check for changes in Application Command Data
 * @param {import("discord.js").APIApplicationCommand & { global: boolean }} oldCmd
 * @param {import("discord.js").RESTPostAPIApplicationCommandsJSONBody & {global: boolean}} newCmd
 * @returns {boolean}
 */
function checkForChangesInCommand(oldCmd, newCmd) {
  // Check name and name localizations
  if (
    (oldCmd.name_localizations || newCmd.name_localizations) &&
    checkForChangesInLocalizations(oldCmd.name_localizations, newCmd.name_localizations)
  ) {
    return true;
  }

  // Check description and description localizations and options only for chat input commands
  if (newCmd.type === ApplicationCommandType.ChatInput) {
    // Check description
    if (oldCmd.description !== newCmd.description) return true;

    // Check description localizations
    if (
      (oldCmd.description_localizations || newCmd.description_localizations) &&
      checkForChangesInLocalizations(
        oldCmd.description_localizations,
        newCmd.description_localizations
      )
    ) {
      return true;
    }

    // Check options
    if (oldCmd.options || newCmd.options) {
      // Check options length
      if ((oldCmd.options?.length ?? 0) !== (newCmd.options?.length ?? 0)) return true;

      // Check options details
      if (checkForChangesInOptions(oldCmd.options, newCmd.options)) return true;
    }
  }

  // Check other properties
  if ((oldCmd.default_member_permissions ?? null) !== (newCmd.default_member_permissions ?? null)) {
    return true;
  }

  // Check nsfw property
  if ((oldCmd.nsfw ?? false) !== (newCmd.nsfw ?? false)) return true;

  // Check contexts and integration types
  if (oldCmd.global || newCmd.global) {
    // Check contexts
    if (oldCmd.contexts || newCmd.contexts) {
      // If one is an array and the other is not
      if (!Array.isArray(oldCmd.contexts) && Array.isArray(newCmd.contexts)) return true;

      // If the old is not an array but the new one is but it's empty or not
      if (Array.isArray(oldCmd.contexts) && !Array.isArray(newCmd.contexts)) return false;

      // If both are arrays, check for differences
      if (Array.isArray(oldCmd.contexts) && Array.isArray(newCmd.contexts)) {
        const addedContext = newCmd.contexts.some((context) => !oldCmd.contexts.includes(context));
        const removedContext = oldCmd.contexts.some(
          (context) => !newCmd.contexts.includes(context)
        );
        if (addedContext || removedContext) return true;
      }
    }

    // Check integration types
    if (oldCmd.integration_types || newCmd.integration_types) {
      // If one is an array and the other is not
      if (!Array.isArray(newCmd.integration_types) && Array.isArray(oldCmd.integration_types)) {
        return false;
      }

      // If both are arrays, check for differences
      if (Array.isArray(oldCmd.integration_types) && Array.isArray(newCmd.integration_types)) {
        const addedIntegrationType = newCmd.integration_types.some(
          (context) => !oldCmd.integration_types.includes(context)
        );
        const removedIntegrationType = oldCmd.integration_types.some(
          (context) => !newCmd.integration_types.includes(context)
        );
        if (addedIntegrationType || removedIntegrationType) return true;
      }
    }
  }

  // If no changes were found
  return false;
}

/** A function to check for changes in options
 * @param {import("discord.js").APIApplicationCommandOption[]} oldOptions
 * @param {import("discord.js").APIApplicationCommandOption[]} newOptions
 * @returns {boolean}
 */
function checkForChangesInOptions(oldOptions = [], newOptions = []) {
  for (const newOption of newOptions) {
    // Find the corresponding old option by name
    const oldOption = oldOptions?.find((option) => option.name === newOption.name);

    // If the option is new
    if (!oldOption) return true;

    // Check option name localizations
    if (oldOption.name_localizations || newOption.name_localizations) {
      if (
        checkForChangesInLocalizations(oldOption.name_localizations, newOption.name_localizations)
      ) {
        return true;
      }
    }

    // Check option description and description localizations
    if (oldOption.description !== newOption.description) return true;
    if (oldOption.description_localizations || newOption.description_localizations) {
      if (
        checkForChangesInLocalizations(
          oldOption.description_localizations,
          newOption.description_localizations
        )
      ) {
        return true;
      }
    }

    // Check other option properties
    if (oldOption.type !== newOption.type) return true;
    if ((oldOption.required ?? false) !== (newOption.required ?? false)) return true;
    if ((oldOption.autocomplete ?? false) !== (newOption.autocomplete ?? false)) return true;
    if ((oldOption.min_length ?? 0) !== (newOption.min_length ?? 0)) return true;
    if ((oldOption.max_length ?? 0) !== (newOption.max_length ?? 0)) return true;
    if ((oldOption.min_value ?? 0) !== (newOption.min_value ?? 0)) return true;
    if ((oldOption.max_value ?? 0) !== (newOption.max_value ?? 0)) return true;

    // Check choices
    if (oldOption.choices || newOption.choices) {
      if ((oldOption.choices.length ?? 0) !== (newOption.choices.length ?? 0)) return true;
      if (checkForChangesInChoices(oldOption.choices, newOption.choices)) return true;
    }

    // Check channel types
    if (oldOption.channel_types || newOption.channel_types) {
      // If one is an array and the other is not
      if (Array.isArray(oldOption.channel_types) && !Array.isArray(newOption.channel_types)) {
        return true;
      }
      // If the old is not an array but the new one is but it's empty
      if (Array.isArray(newOption.channel_types) && !Array.isArray(oldOption.channel_types)) {
        if (newOption.channel_types?.length > 0) return true;
      }

      // If both are arrays, check for differences
      if (Array.isArray(oldOption.channel_types) && Array.isArray(newOption.channel_types)) {
        // If the lengths are different
        if (oldOption.channel_types.length !== newOption.channel_types.length) return true;

        // If there are any differences in the arrays
        const addedChannelType = newOption.channel_types.some(
          (context) => !oldOption.channel_types.includes(context)
        );
        const removedChannelType = oldOption.channel_types.some(
          (context) => !newOption.channel_types.includes(context)
        );
        if (addedChannelType || removedChannelType) return true;
      }
    }

    // If the option is a subcommand or subcommand group, check its options recursively
    if ((oldOption.options || newOption.options) && [1, 2].includes(newOption.type)) {
      if ((oldOption.options?.length ?? 0) !== (newOption.options?.length ?? 0)) return true;
      if (checkForChangesInOptions(oldOption.options, newOption.options)) return true;
    }
  }

  // If no changes were found
  return false;
}

/** A function to check for changes in string option choices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} oldChoices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} newChoices
 * @returns {boolean}
 */
function checkForChangesInChoices(oldChoices = [], newChoices = []) {
  for (const newChoice of newChoices) {
    // Find the corresponding old choice by name
    const oldChoice = oldChoices?.find((choice) => choice.name === newChoice.name);

    // If the choice is new
    if (!oldChoice) return true;

    // Check choice properties
    if (oldChoice.value !== newChoice.value) return true;
    if (
      (oldChoice.name_localizations || newChoice.name_localizations) &&
      checkForChangesInLocalizations(oldChoice.name_localizations, newChoice.name_localizations)
    ) {
      return true;
    }
  }

  // If no changes were found
  return false;
}

/** A function to check for changes in name localizations
 * @param {import("discord.js").LocalizationMap} oldLocalizations
 * @param {import("discord.js").LocalizationMap} newLocalizations
 * @returns {boolean}
 */
function checkForChangesInLocalizations(oldLocalizations = {}, newLocalizations = {}) {
  // If both are null or undefined
  if (!oldLocalizations && !newLocalizations) return false;

  // If one is null/undefined and the other is not
  if ((oldLocalizations && !newLocalizations) || (!oldLocalizations && newLocalizations)) {
    return true;
  }

  // Check if the number of locales is different
  if (Object.keys(oldLocalizations).length !== Object.keys(newLocalizations).length) {
    return true;
  }

  // Check each locale for differences
  for (const locale of Object.values(Locale)) {
    // If the locale exists in one but not the other
    if (oldLocalizations[locale] !== newLocalizations[locale]) {
      return true;
    }
  }

  // If no changes were found
  return false;
}

module.exports = {
  checkForChangesInCommand,
  checkForChangesInLocalizations,
  checkForChangesInChoices,
  checkForChangesInOptions,
};
