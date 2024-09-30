/** @type {import("@src/index").CheckForChanges} */
async function checkForChange(OldCommand, NewCommand) {
    const oldCommand = OldCommand.data;
    const newCommand = NewCommand.data;

    if (oldCommand.nameLocalizations || newCommand.name_localizations) {
        if (
            await checkForChangeInNameLocalization(
                oldCommand.nameLocalizations,
                newCommand.name_localizations,
            )
        ) {
            return true;
        }
    }

    if ((oldCommand.type || newCommand.type) === 1) {
        if (oldCommand.description !== newCommand.description) {
            return true;
        }

        if (oldCommand.descriptionLocalizations || newCommand.description_localizations) {
            if (
                await checkForChangeInDescriptionLocalization(
                    oldCommand.descriptionLocalizations,
                    newCommand.description_localizations,
                )
            ) {
                return true;
            }
        }
    }

    if (
        oldCommand.defaultMemberPermissions !=
        (newCommand.default_member_permissions || null)
    ) {
        return true;
    }

    if (oldCommand.nsfw !== (newCommand.nsfw || false)) return true;

    if (OldCommand.global || NewCommand.global) {
        if (oldCommand.contexts || newCommand.contexts) {
            if (
                Array.isArray(oldCommand.contexts) &&
                Array.isArray(newCommand.contexts)
            ) {
                if (
                    oldCommand.contexts.map((c) => c).join("") !==
                    newCommand.contexts.map((c) => c).join("")
                ) {
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
                if (
                    oldCommand.integrationTypes.map((c) => c).join("") !==
                    newCommand.integration_types.map((c) => c).join("")
                ) {
                    return true;
                }
            }
        }
    }

    if (oldCommand.options || newCommand.options) {
        if (oldCommand.options.length !== newCommand.options.length) return true;

        if (await checkForChangesinOptions(oldCommand.options, newCommand.options)) {
            return true;
        }
    }

    return false;
}

//options: undefined,
//channelTypes: undefined,

/** @type {import("@src/index").CheckForChangeInChoices} */
async function checkForChangeInChoices(oldChoices, newChoices) {
    for (const newChoice of newChoices) {
        const oldChoice = oldChoices?.find((choice) => choice.name === newChoice.name);

        if (!oldChoice) return true;

        if (oldChoice.value !== newChoice.value) return true;

        if (oldChoice.nameLocalizations || newChoice.name_localizations) {
            console.log(oldChoice.nameLocalizations);
            console.log(newChoice.name_localizations);

            if (
                await checkForChangeInNameLocalization(
                    oldChoice.nameLocalizations,
                    newChoice.name_localizations,
                )
            ) {
                return true;
            }
        }
    }
}

/** @type {import("@src/index").CheckForChangesinOptions} */
async function checkForChangesinOptions(oldOptions, newOptions) {
    for (const newOption of newOptions) {
        const oldOption = oldOptions.find((option) => option.name === newOption.name);

        if (!oldOption) return true;

        if (oldOption.nameLocalizations || newOption.name_localizations) {
            if (
                await checkForChangeInNameLocalization(
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
                await checkForChangeInDescriptionLocalization(
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

            if (await checkForChangeInChoices(oldOption.choices, newOption.choices)) {
                return true;
            }
        }
    }

    return false;
}

/** @type {import("@src/index").CheckForChangeInNameLocalization} */
function checkForChangeInNameLocalization(nameLocalizations, name_localizations) {
    if (nameLocalizations?.bg !== name_localizations?.bg) return true;
    if (nameLocalizations?.cs !== name_localizations?.cs) return true;
    if (nameLocalizations?.da !== name_localizations?.da) return true;
    if (nameLocalizations?.de !== name_localizations?.de) return true;
    if (nameLocalizations?.el !== name_localizations?.el) return true;
    if (nameLocalizations?.["en-GB"] !== name_localizations?.["en-GB"]) return true;
    if (nameLocalizations?.["en-US"] !== name_localizations?.["en-US"]) return true;
    if (nameLocalizations?.["es-419"] !== name_localizations?.["es-419"]) return true;
    if (nameLocalizations?.["es-ES"] !== name_localizations?.["es-ES"]) return true;
    if (nameLocalizations?.fi !== name_localizations?.fi) return true;
    if (nameLocalizations?.fr !== name_localizations?.fr) return true;
    if (nameLocalizations?.hi !== name_localizations?.hi) return true;
    if (nameLocalizations?.hr !== name_localizations?.hr) return true;
    if (nameLocalizations?.hu !== name_localizations?.hu) return true;
    if (nameLocalizations?.id !== name_localizations?.id) return true;
    if (nameLocalizations?.it !== name_localizations?.it) return true;
    if (nameLocalizations?.ja !== name_localizations?.ja) return true;
    if (nameLocalizations?.ko !== name_localizations?.ko) return true;
    if (nameLocalizations?.lt !== name_localizations?.lt) return true;
    if (nameLocalizations?.nl !== name_localizations?.nl) return true;
    if (nameLocalizations?.no !== name_localizations?.no) return true;
    if (nameLocalizations?.pl !== name_localizations?.pl) return true;
    if (nameLocalizations?.["pt-BR"] !== name_localizations?.["pt-BR"]) return true;
    if (nameLocalizations?.ro !== name_localizations?.ro) return true;
    if (nameLocalizations?.ru !== name_localizations?.ru) return true;
    if (nameLocalizations?.["sv-SE"] !== name_localizations?.["sv-SE"]) return true;
    if (nameLocalizations?.th !== name_localizations?.th) return true;
    if (nameLocalizations?.tr !== name_localizations?.tr) return true;
    if (nameLocalizations?.uk !== name_localizations?.uk) return true;
    if (nameLocalizations?.vi !== name_localizations?.vi) return true;
    if (nameLocalizations?.["zh-CN"] !== name_localizations?.["zh-CN"]) return true;
    if (nameLocalizations?.["zh-TW"] !== name_localizations?.["zh-TW"]) return true;
}

/** @type {import("@src/index").CheckForChangeInDescriptionLocalization} */
function checkForChangeInDescriptionLocalization(
    descriptionLocalizations,
    description_localizations,
) {
    if (descriptionLocalizations?.bg !== description_localizations?.bg) return true;
    if (descriptionLocalizations?.cs !== description_localizations?.cs) return true;
    if (descriptionLocalizations?.da !== description_localizations?.da) return true;
    if (descriptionLocalizations?.de !== description_localizations?.de) return true;
    if (descriptionLocalizations?.el !== description_localizations?.el) return true;
    if (descriptionLocalizations?.["en-GB"] !== description_localizations?.["en-GB"]) {
        return true;
    }
    if (descriptionLocalizations?.["en-US"] !== description_localizations?.["en-US"]) {
        return true;
    }
    if (descriptionLocalizations?.["es-419"] !== description_localizations?.["es-419"]) {
        return true;
    }
    if (descriptionLocalizations?.["es-ES"] !== description_localizations?.["es-ES"]) {
        return true;
    }
    if (descriptionLocalizations?.fi !== description_localizations?.fi) return true;
    if (descriptionLocalizations?.fr !== description_localizations?.fr) return true;
    if (descriptionLocalizations?.hi !== description_localizations?.hi) return true;
    if (descriptionLocalizations?.hr !== description_localizations?.hr) return true;
    if (descriptionLocalizations?.hu !== description_localizations?.hu) return true;
    if (descriptionLocalizations?.id !== description_localizations?.id) return true;
    if (descriptionLocalizations?.it !== description_localizations?.it) return true;
    if (descriptionLocalizations?.ja !== description_localizations?.ja) return true;
    if (descriptionLocalizations?.ko !== description_localizations?.ko) return true;
    if (descriptionLocalizations?.lt !== description_localizations?.lt) return true;
    if (descriptionLocalizations?.nl !== description_localizations?.nl) return true;
    if (descriptionLocalizations?.no !== description_localizations?.no) return true;
    if (descriptionLocalizations?.pl !== description_localizations?.pl) return true;
    if (descriptionLocalizations?.["pt-BR"] !== description_localizations?.["pt-BR"]) {
        return true;
    }
    if (descriptionLocalizations?.ro !== description_localizations?.ro) return true;
    if (descriptionLocalizations?.ru !== description_localizations?.ru) return true;
    if (descriptionLocalizations?.["sv-SE"] !== description_localizations?.["sv-SE"]) {
        return true;
    }
    if (descriptionLocalizations?.th !== description_localizations?.th) return true;
    if (descriptionLocalizations?.tr !== description_localizations?.tr) return true;
    if (descriptionLocalizations?.uk !== description_localizations?.uk) return true;
    if (descriptionLocalizations?.vi !== description_localizations?.vi) return true;
    if (descriptionLocalizations?.["zh-CN"] !== description_localizations?.["zh-CN"]) {
        return true;
    }
    if (descriptionLocalizations?.["zh-TW"] !== description_localizations?.["zh-TW"]) {
        return true;
    }
}

module.exports = { checkForChange };
