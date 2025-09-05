const { ApplicationCommandType, Locale } = require("discord.js");

/**
 * A function to check for changes in Application Command Data
 * @param {import("discord.js").APIApplicationCommand & { global: boolean }} oldCommand
 * @param {import("discord.js").RESTPostAPIApplicationCommandsJSONBody & {global: boolean}} newCommand
 * @returns {boolean}
 */
function checkForChangesInCommand(oldCommand, newCommand) {
  if (oldCommand.name_localizations || newCommand.name_localizations) {
    if (
      checkForChangesInLocalizations(oldCommand.name_localizations, newCommand.name_localizations)
    ) {
      return true;
    }
  }

  if (newCommand.type === ApplicationCommandType.ChatInput) {
    if (oldCommand.description !== newCommand.description) return true;
    if (oldCommand.description_localizations || newCommand.description_localizations) {
      if (
        checkForChangesInLocalizations(
          oldCommand.description_localizations,
          newCommand.description_localizations
        )
      ) {
        return true;
      }
    }

    if (oldCommand.options || newCommand.options) {
      if (oldCommand.options?.length || 0 !== newCommand.options?.length || 0) return true;
      if (checkForChangesInOptions(oldCommand.options, newCommand.options)) return true;
    }
  }

  if (oldCommand.default_member_permissions != (newCommand.default_member_permissions ?? null)) {
    return true;
  }

  if (oldCommand.nsfw !== (newCommand.nsfw ?? false)) return true;

  if (oldCommand.global || newCommand.global) {
    if (oldCommand.contexts || newCommand.contexts) {
      if (Array.isArray(oldCommand.contexts) && Array.isArray(newCommand.contexts)) {
        const addedContext = newCommand.contexts.some(
          (context) => !oldCommand.contexts.includes(context)
        );
        const removedContext = oldCommand.contexts.some(
          (context) => !newCommand.contexts.includes(context)
        );
        if (addedContext || removedContext) return true;
      } else return true;
    }

    if (oldCommand.integration_types || newCommand.integration_types) {
      if (!Array.isArray(newCommand.integration_types)) {
        if (oldCommand.integration_types.join("") !== "0") return true;
      }

      if (
        Array.isArray(oldCommand.integration_types) &&
        Array.isArray(newCommand.integration_types)
      ) {
        const addedIntegrationType = newCommand.integration_types.some(
          (context) => !oldCommand.integration_types.includes(context)
        );
        const removedIntegrationType = oldCommand.integration_types.some(
          (context) => !newCommand.integration_types.includes(context)
        );
        if (addedIntegrationType || removedIntegrationType) return true;
      }
    }
  }

  return false;
}

/** A function to check for changes in options
 * @param {import("discord.js").APIApplicationCommandOption[]} oldOptions
 * @param {import("discord.js").APIApplicationCommandOption[]} newOptions
 * @returns {boolean}
 */
function checkForChangesInOptions(oldOptions = [], newOptions = []) {
  for (const newOption of newOptions) {
    const oldOption = oldOptions?.find((option) => option.name === newOption.name);

    if (!oldOption) return true;
    if (oldOption.name_localizations || newOption.name_localizations) {
      if (
        checkForChangesInLocalizations(oldOption.name_localizations, newOption.name_localizations)
      ) {
        return true;
      }
    }

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

    if (oldOption.type !== newOption.type) return true;
    if ((oldOption.required ?? false) !== (newOption.required ?? false)) return true;
    if ((oldOption.autocomplete ?? false) !== (newOption.autocomplete ?? false)) return true;
    if ((oldOption.min_length ?? 0) !== (newOption.min_length ?? 0)) return true;
    if ((oldOption.max_length ?? 0) !== (newOption.max_length ?? 0)) return true;
    if ((oldOption.min_value ?? 0) !== (newOption.min_value ?? 0)) return true;
    if ((oldOption.max_value ?? 0) !== (newOption.max_value ?? 0)) return true;

    if (oldOption.choices || newOption.choices) {
      if ((oldOption.choices.length ?? 0) !== (newOption.choices.length ?? 0)) return true;
      if (checkForChangesInChoices(oldOption.choices, newOption.choices)) return true;
    }

    if (oldOption.channelTypes || newOption.channel_types) {
      if (Array.isArray(oldOption.channelTypes) && Array.isArray(newOption.channel_types)) {
        const addedChannelType = newOption.channel_types.some(
          (context) => !oldOption.channelTypes.includes(context)
        );
        const removedChannelType = oldOption.channelTypes.some(
          (context) => !newOption.channel_types.includes(context)
        );
        if (addedChannelType || removedChannelType) return true;
      } else return true;
    }

    if ((oldOption.options || newOption.options) && [1, 2].includes(newOption.type)) {
      if (oldOption.options?.length || 0 !== newOption.options?.length || 0) return true;
      if (checkForChangesInOptions(oldOption.options, newOption.options)) return true;
    }
  }

  return false;
}

/** A function to check for changes in string option choices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} oldChoices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} newChoices
 * @returns {boolean}
 */
function checkForChangesInChoices(oldChoices = [], newChoices = []) {
  for (const newChoice of newChoices) {
    const oldChoice = oldChoices?.find((choice) => choice.name === newChoice.name);

    if (!oldChoice) return true;
    if (oldChoice.value !== newChoice.value) return true;
    if (
      (oldChoice.name_localizations || newChoice.name_localizations) &&
      checkForChangesInLocalizations(oldChoice.name_localizations, newChoice.name_localizations)
    ) {
      return true;
    }
  }

  return false;
}

/** A function to check for changes in name localizations
 * @param {import("discord.js").LocalizationMap} oldLocalizations
 * @param {import("discord.js").LocalizationMap} newLocalizations
 * @returns {boolean}
 */
function checkForChangesInLocalizations(oldLocalizations = {}, newLocalizations = {}) {
  for (const locale of Object.values(Locale)) {
    if (oldLocalizations[locale] !== newLocalizations[locale]) {
      return true;
    }
  }
  return false;
}

module.exports = {
  checkForChangesInCommand,
  checkForChangesInLocalizations,
  checkForChangesInChoices,
  checkForChangesInOptions,
};
