const colors = require("colors");

/** @type {import("@src/index").CheckForChanges} */
module.exports = async (newCommands, oldCommands) => {
    newCommands.forEach(async (newCommand) => {
        const oldCommand = oldCommands.find(
            (command) => command.name === newCommand.name,
        );

        const change = await changes(newCommand, oldCommand);

        console.log(change);
    });
};

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

    if (
        existingCommand.description !== localCommand.description ||
        existingCommand.options?.length !== (localCommand.options?.length || 0) ||
        areOptionsDifferent(existingCommand.options, localCommand.options || [])
    ) {
        return true;
    }

    return false;
};

