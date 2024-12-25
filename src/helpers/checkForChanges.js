/** A function to check for changes in Application Command Data
 * @param {import("@types/types").OldCommand} OldCommand
 * @param {import("@types/types").NewCommand} NewCommand
 * @returns {boolean}
 */
function checkForChange(OldCommand, NewCommand) {
  const oldCommand = OldCommand.data;
  const newCommand = NewCommand.data;

  if (oldCommand.nameLocalizations || newCommand.name_localizations) {
    if (
      checkForChangeInNameLocalization(
        oldCommand.nameLocalizations,
        newCommand.name_localizations,
      )
    ) {
      return true;
    }
  }

  if ((oldCommand.type || newCommand.type) === 1) {
    if (oldCommand.description !== newCommand.description) return true;

    if (oldCommand.descriptionLocalizations || newCommand.description_localizations) {
      if (
        checkForChangeInDescriptionLocalization(
          oldCommand.descriptionLocalizations,
          newCommand.description_localizations,
        )
      ) {
        return true;
      }
    }

    if (oldCommand.options || newCommand.options) {
      if (oldCommand.options.length !== newCommand.options.length) return true;

      if (checkForChangesInOptions(oldCommand.options, newCommand.options)) {
        return true;
      }
    }
  }

  if (
    oldCommand.defaultMemberPermissions != (newCommand.default_member_permissions || null)
  ) {
    return true;
  }

  if (oldCommand.nsfw !== (newCommand.nsfw || false)) return true;

  if (OldCommand.global || NewCommand.global) {
    if (oldCommand.contexts || newCommand.contexts) {
      if (Array.isArray(oldCommand.contexts) && Array.isArray(newCommand.contexts)) {
        const addedContext = newCommand.contexts.some(
          (context) => !oldCommand.contexts.includes(context),
        );
        const removedContext = oldCommand.contexts.some(
          (context) => !newCommand.contexts.includes(context),
        );

        if (addedContext || removedContext) {
          return true;
        }
      } else {
        return true;
      }
    }

    if (oldCommand.integrationTypes || newCommand.integration_types) {
      if (!Array.isArray(newCommand.integration_types)) {
        if (oldCommand.integrationTypes.map((i) => i).join("") !== "0") {
          return true;
        }
      }

      if (
        Array.isArray(oldCommand.integrationTypes) &&
        Array.isArray(newCommand.integration_types)
      ) {
        const addedIntegrationType = newCommand.integration_types.some(
          (context) => !oldCommand.integrationTypes.includes(context),
        );
        const removedIntegrationType = oldCommand.integrationTypes.some(
          (context) => !newCommand.integration_types.includes(context),
        );

        if (addedIntegrationType || removedIntegrationType) {
          return true;
        }
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
    const oldOption = oldOptions.find((option) => option.name === newOption.name);

    if (!oldOption) return true;

    if (oldOption.nameLocalizations || newOption.name_localizations) {
      if (
        checkForChangeInNameLocalization(
          oldOption.nameLocalizations,
          newOption.name_localizations,
        )
      ) {
        return true;
      }
    }

    if (oldOption.description !== newOption.description) return true;

    if (oldOption.descriptionLocalizations || newOption.description_localizations) {
      if (
        checkForChangeInDescriptionLocalization(
          oldOption.descriptionLocalizations,
          newOption.description_localizations,
        )
      ) {
        return true;
      }
    }

    if (oldOption.type !== newOption.type) return true;

    if ((oldOption.required || false) !== (newOption?.required || false)) {
      return true;
    }

    if ((oldOption.autocomplete || false) !== (newOption?.autocomplete || false)) {
      return true;
    }

    if ((oldOption.minLength || 0) !== (newOption?.min_length || 0)) return true;
    if ((oldOption.maxLength || 0) !== (newOption?.max_length || 0)) return true;

    if ((oldOption.minValue || 0) !== (newOption.min_value || 0)) return true;
    if ((oldOption.maxValue || 0) !== (newOption.max_value || 0)) return true;

    if (oldOption.choices || newOption.choices) {
      if ((oldOption.choices.length || 0) !== (newOption.choices.length || 0)) {
        return true;
      }

      if (checkForChangeInChoices(oldOption.choices, newOption.choices)) {
        return true;
      }
    }

    if (oldOption.channelTypes || newOption.channel_types) {
      if (
        Array.isArray(oldOption.channelTypes) &&
        Array.isArray(newOption.channel_types)
      ) {
        const addedChannelType = newOption.channel_types.some(
          (context) => !oldOption.channelTypes.includes(context),
        );
        const removedChannelType = oldOption.channelTypes.some(
          (context) => !newOption.channel_types.includes(context),
        );

        if (addedChannelType || removedChannelType) return true;
      } else {
        return true;
      }
    }

    if (oldOption.options || newOption.options) {
      if (checkForChangesInOptions(oldOption.options, newOption.options)) return true;
    }
  }

  return false;
}

/** A function to check for changes in string option choices
 * @param {import("discord.js").ApplicationCommandOptionChoiceData[]} oldChoices
 * @param {import("discord.js").APIApplicationCommandOptionChoice[]} newChoices
 * @returns {boolean}
 */
function checkForChangeInChoices(oldChoices, newChoices) {
  for (const newChoice of newChoices) {
    const oldChoice = oldChoices?.find((choice) => choice.name === newChoice.name);

    if (!oldChoice) return true;

    if (oldChoice.value !== newChoice.value) return true;

    if (oldChoice.nameLocalizations || newChoice.name_localizations) {
      if (
        checkForChangeInNameLocalization(
          oldChoice.nameLocalizations,
          newChoice.name_localizations,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/** A function to check for changes in name localizations
 * @param {import("discord.js").LocalizationMap} nLocalizations
 * @param {import("discord.js").LocalizationMap} n_localizations
 * @returns {boolean}
 */
function checkForChangeInNameLocalization(nLocalizations, n_localizations) {
  if (nLocalizations?.bg !== n_localizations?.bg) return true;
  if (nLocalizations?.cs !== n_localizations?.cs) return true;
  if (nLocalizations?.da !== n_localizations?.da) return true;
  if (nLocalizations?.de !== n_localizations?.de) return true;
  if (nLocalizations?.el !== n_localizations?.el) return true;
  if (nLocalizations?.["en-GB"] !== n_localizations?.["en-GB"]) return true;
  if (nLocalizations?.["en-US"] !== n_localizations?.["en-US"]) return true;
  if (nLocalizations?.["es-419"] !== n_localizations?.["es-419"]) return true;
  if (nLocalizations?.["es-ES"] !== n_localizations?.["es-ES"]) return true;
  if (nLocalizations?.fi !== n_localizations?.fi) return true;
  if (nLocalizations?.fr !== n_localizations?.fr) return true;
  if (nLocalizations?.hi !== n_localizations?.hi) return true;
  if (nLocalizations?.hr !== n_localizations?.hr) return true;
  if (nLocalizations?.hu !== n_localizations?.hu) return true;
  if (nLocalizations?.id !== n_localizations?.id) return true;
  if (nLocalizations?.it !== n_localizations?.it) return true;
  if (nLocalizations?.ja !== n_localizations?.ja) return true;
  if (nLocalizations?.ko !== n_localizations?.ko) return true;
  if (nLocalizations?.lt !== n_localizations?.lt) return true;
  if (nLocalizations?.nl !== n_localizations?.nl) return true;
  if (nLocalizations?.no !== n_localizations?.no) return true;
  if (nLocalizations?.pl !== n_localizations?.pl) return true;
  if (nLocalizations?.["pt-BR"] !== n_localizations?.["pt-BR"]) return true;
  if (nLocalizations?.ro !== n_localizations?.ro) return true;
  if (nLocalizations?.ru !== n_localizations?.ru) return true;
  if (nLocalizations?.["sv-SE"] !== n_localizations?.["sv-SE"]) return true;
  if (nLocalizations?.th !== n_localizations?.th) return true;
  if (nLocalizations?.tr !== n_localizations?.tr) return true;
  if (nLocalizations?.uk !== n_localizations?.uk) return true;
  if (nLocalizations?.vi !== n_localizations?.vi) return true;
  if (nLocalizations?.["zh-CN"] !== n_localizations?.["zh-CN"]) return true;
  if (nLocalizations?.["zh-TW"] !== n_localizations?.["zh-TW"]) return true;

  return false;
}

/** A function to check for changes in description localizations
 * @param {import("discord.js").LocalizationMap} dLocalizations
 * @param {import("discord.js").LocalizationMap} d_localizations
 * @returns {boolean}
 */
function checkForChangeInDescriptionLocalization(dLocalizations, d_localizations) {
  if (dLocalizations?.bg !== d_localizations?.bg) return true;
  if (dLocalizations?.cs !== d_localizations?.cs) return true;
  if (dLocalizations?.da !== d_localizations?.da) return true;
  if (dLocalizations?.de !== d_localizations?.de) return true;
  if (dLocalizations?.el !== d_localizations?.el) return true;
  if (dLocalizations?.["en-GB"] !== d_localizations?.["en-GB"]) return true;
  if (dLocalizations?.["en-US"] !== d_localizations?.["en-US"]) return true;
  if (dLocalizations?.["es-419"] !== d_localizations?.["es-419"]) return true;
  if (dLocalizations?.["es-ES"] !== d_localizations?.["es-ES"]) return true;
  if (dLocalizations?.fi !== d_localizations?.fi) return true;
  if (dLocalizations?.fr !== d_localizations?.fr) return true;
  if (dLocalizations?.hi !== d_localizations?.hi) return true;
  if (dLocalizations?.hr !== d_localizations?.hr) return true;
  if (dLocalizations?.hu !== d_localizations?.hu) return true;
  if (dLocalizations?.id !== d_localizations?.id) return true;
  if (dLocalizations?.it !== d_localizations?.it) return true;
  if (dLocalizations?.ja !== d_localizations?.ja) return true;
  if (dLocalizations?.ko !== d_localizations?.ko) return true;
  if (dLocalizations?.lt !== d_localizations?.lt) return true;
  if (dLocalizations?.nl !== d_localizations?.nl) return true;
  if (dLocalizations?.no !== d_localizations?.no) return true;
  if (dLocalizations?.pl !== d_localizations?.pl) return true;
  if (dLocalizations?.["pt-BR"] !== d_localizations?.["pt-BR"]) return true;
  if (dLocalizations?.ro !== d_localizations?.ro) return true;
  if (dLocalizations?.ru !== d_localizations?.ru) return true;
  if (dLocalizations?.["sv-SE"] !== d_localizations?.["sv-SE"]) return true;
  if (dLocalizations?.th !== d_localizations?.th) return true;
  if (dLocalizations?.tr !== d_localizations?.tr) return true;
  if (dLocalizations?.uk !== d_localizations?.uk) return true;
  if (dLocalizations?.vi !== d_localizations?.vi) return true;
  if (dLocalizations?.["zh-CN"] !== d_localizations?.["zh-CN"]) return true;
  if (dLocalizations?.["zh-TW"] !== d_localizations?.["zh-TW"]) return true;

  return false;
}

module.exports = { checkForChange };
