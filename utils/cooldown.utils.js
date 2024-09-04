async function onCoolDown(client, interaction, command) {
    const now = Date.now();
    const timestamps = await client.cooldowns.get(
        command.data?.name || command?.name
    );
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (!timestamps) return false;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime =
            (await timestamps.get(interaction.user.id)) + cooldownAmount;

        if (now < expirationTime) {
            const timeleft = (expirationTime - now) / 1000;
            return timeleft;
        } else {
            await timestamps.set(interaction.user.id, now);
            setTimeout(
                () => timestamps.delete(interaction.user.id),
                cooldownAmount
            );
            return false;
        }
    } else {
        await timestamps.set(interaction.user.id, now);
        setTimeout(
            () => timestamps.delete(interaction.user.id),
            cooldownAmount
        );
        return false;
    }
}

module.exports = { onCoolDown };
