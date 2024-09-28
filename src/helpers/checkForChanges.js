/** @type {import("@src/index").CheckForChanges} */
module.exports = async (oldCommand, newCommand) => {
    const { nameLocalizations, descriptionLocalizations } = oldCommand;
    const { name_localizations, description_localizations } = newCommand;

    if (nameLocalizations || name_localizations) {
        return await checkForChangeInNameLocalization(
            nameLocalizations,
            name_localizations,
        );
    }

    if ((oldCommand.type || newCommand.type) === 1) {
        if (oldCommand?.description !== newCommand?.description) {
            return true;
        }

        if (descriptionLocalizations || description_localizations) {
            return await checkForChangeInDescriptionLocalization(
                descriptionLocalizations,
                description_localizations,
            );
        }
    }

    if (oldCommand?.defaultMemberPermissions || newCommand?.default_member_permissions) {
        if (
            oldCommand?.defaultMemberPermissions.toJSON() !==
            (newCommand?.default_member_permissions || null)
        ) {
            return true;
        }
    }

    if (oldCommand.nsfw !== (newCommand.nsfw || false)) return true;

    //if (oldCommand?.contexts || newCommand?.contexts) {
    //    oldCommand?.contexts.forEach((c) => {
    //        if (newCommand.contexts.includes(c)) return false;
    //        else return true;
    //    });
    //    return false;
    //
    //    if (
    //        oldCommand?.contexts.flatMap((e) => e) ===
    //        newCommand?.contexts.flatMap((e) => e)
    //    ) {
    //        console.log(oldCommand.contexts);
    //        console.log(newCommand.contexts);
    //    }
    //}

    //if (!oldCommand.options?.length === (newCommand.options?.length || 0)) return true;

    return false;
};

/*
{ 
  options: [],
  integrationTypes: [ 0 ],
  contexts: null,
}
*/

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
    return false;
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
    return false;
}

const changes = (existingCommand, localCommand) => {
    const areChoicesDifferent = (existingChoices, localChoices) => {
        for (const localChoice of localChoices) {
            const existingChoice = existingChoices?.find(
                (choice) => choice.name === localChoice.name,
            );

            if (!existingChoice) {
                return true;
            }

            if (localChoice.value !== existingChoice.value) {
                return true;
            }
        }
        return false;
    };

    const areOptionsDifferent = (existingOptions, localOptions) => {
        for (const localOption of localOptions) {
            const existingOption = existingOptions?.find(
                (option) => option.name === localOption.name,
            );

            if (!existingOption) {
                return true;
            }

            if (
                localOption.description !== existingOption.description ||
                localOption.type !== existingOption.type ||
                (localOption.required || false) !== existingOption.required ||
                (localOption.choices?.length || 0) !==
                    (existingOption.choices?.length || 0) ||
                areChoicesDifferent(
                    localOption.choices || [],
                    existingOption.choices || [],
                )
            ) {
                return true;
            }
        }
        return false;
    };

    if (areOptionsDifferent(existingCommand.options, localCommand.options || [])) {
        return true;
    }

    return false;
};

