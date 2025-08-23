const { ApplicationCommandType, Locale } = require("discord.js");

/**
 * A function to check for changes in Application Command Data
 * @param {import("@types/index").OldCommand} OldCommand
 * @param {import("@types/index").CommandStructure} NewCommand
 * @returns {boolean}
 */
function checkForChangesInCommand(OldCommand, NewCommand) {
  const oldCommand = OldCommand.data;
  const newCommand = NewCommand.data.toJSON();

  if (oldCommand.nameLocalizations || newCommand.name_localizations) {
    if (
      checkForChangesInLocalizations(oldCommand.nameLocalizations, newCommand.name_localizations)
    ) {
      return true;
    }
  }

  if ((oldCommand.type || newCommand.type) === ApplicationCommandType.ChatInput) {
    if (oldCommand.description !== newCommand.description) return true;

    if (oldCommand.descriptionLocalizations || newCommand.description_localizations) {
      if (
        checkForChangesInLocalizations(
          oldCommand.descriptionLocalizations,
          newCommand.description_localizations
        )
      ) {
        return true;
      }
    }

    if (oldCommand.options || newCommand.options) {
      if (oldCommand.options.length !== newCommand.options.length) return true;

      if (checkForChangesInOptions(oldCommand.options, newCommand.options)) return true;
    }
  }

  if (oldCommand.defaultMemberPermissions != (newCommand.default_member_permissions ?? null)) {
    return true;
  }

  if (oldCommand.nsfw !== (newCommand.nsfw ?? false)) return true;

  if (OldCommand.global || NewCommand.global) {
    if (oldCommand.contexts || newCommand.contexts) {
      if (Array.isArray(oldCommand.contexts) && Array.isArray(newCommand.contexts)) {
        const addedContext = newCommand.contexts.some(
          (context) => !oldCommand.contexts.includes(context)
        );

        const removedContext = oldCommand.contexts.some(
          (context) => !newCommand.contexts.includes(context)
        );

        if (addedContext || removedContext) return true;
      } else {
        return true;
      }
    }

    if (oldCommand.integrationTypes || newCommand.integration_types) {
      if (!Array.isArray(newCommand.integration_types)) {
        if (oldCommand.integrationTypes.join("") !== "0") return true;
      }

      if (
        Array.isArray(oldCommand.integrationTypes) &&
        Array.isArray(newCommand.integration_types)
      ) {
        const addedIntegrationType = newCommand.integration_types.some(
          (context) => !oldCommand.integrationTypes.includes(context)
        );

        const removedIntegrationType = oldCommand.integrationTypes.some(
          (context) => !newCommand.integration_types.includes(context)
        );

        if (addedIntegrationType || removedIntegrationType) return true;
      }
    }
  }

  return false;
}

/** A function to check for changes in options
 * @param {import("discord.js").ApplicationCommandOption[]} oldOptions
 * @param {import("discord.js").APIApplicationCommandOption[]} newOptions
 * @returns {boolean}
 */
function checkForChangesInOptions(oldOptions, newOptions) {
  for (const newOption of newOptions) {
    const oldOption = oldOptions?.find((option) => option.name === newOption.name);

    if (!oldOption) return true;

    if (oldOption.nameLocalizations || newOption.name_localizations) {
      if (
        checkForChangesInLocalizations(oldOption.nameLocalizations, newOption.name_localizations)
      ) {
        return true;
      }
    }

    if (oldOption.description !== newOption.description) return true;

    if (oldOption.descriptionLocalizations || newOption.description_localizations) {
      if (
        checkForChangesInLocalizations(
          oldOption.descriptionLocalizations,
          newOption.description_localizations
        )
      ) {
        return true;
      }
    }

    if (oldOption.type !== newOption.type) return true;

    if ((oldOption.required ?? false) !== (newOption?.required ?? false)) {
      return true;
    }
    if ((oldOption.autocomplete ?? false) !== (newOption?.autocomplete ?? false)) {
      return true;
    }

    if ((oldOption.minLength ?? 0) !== (newOption?.min_length ?? 0)) {
      return true;
    }
    if ((oldOption.maxLength ?? 0) !== (newOption?.max_length ?? 0)) {
      return true;
    }
    if ((oldOption.minValue ?? 0) !== (newOption.min_value ?? 0)) return true;
    if ((oldOption.maxValue ?? 0) !== (newOption.max_value ?? 0)) return true;

    if (oldOption.choices || newOption.choices) {
      if ((oldOption.choices.length ?? 0) !== (newOption.choices.length ?? 0)) {
        return true;
      }
      if (checkForChangesInChoices(oldOption.choices, newOption.choices)) {
        return true;
      }
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
      } else {
        return true;
      }
    }

    if (oldOption.options || newOption.options) {
      if (checkForChangesInOptions(oldOption.options, newOption.options)) {
        return true;
      }
    }
  }

  return false;
}

/** A function to check for changes in string option choices
 * @param {import("discord.js").ApplicationCommandOptionChoiceData[]} oldChoices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} newChoices
 * @returns {boolean}
 */
function checkForChangesInChoices(oldChoices = [], newChoices = []) {
  for (const newChoice of newChoices) {
    const oldChoice = oldChoices?.find((choice) => choice.name === newChoice.name);

    if (!oldChoice) return true;
    if (oldChoice.value !== newChoice.value) return true;

    if (oldChoice.nameLocalizations || newChoice.name_localizations) {
      if (
        checkForChangesInLocalizations(oldChoice.nameLocalizations, newChoice.name_localizations)
      ) {
        return true;
      }
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
  let isLocalesChanged = false;

  Object.values(Locale).forEach((locale) => {
    if (oldLocalizations[locale] !== newLocalizations[locale]) {
      isLocalesChanged = true;
    }
  });

  return isLocalesChanged;
}

module.exports = {
  checkForChangesInCommand,
  checkForChangesInLocalizations,
  checkForChangesInChoices,
  checkForChangesInOptions,
};
