const { Collection } = require("discord.js");

/**
 * A function to set, get and delete command cooldowns
 * @param {import("@src/lib").DiscordClient} client the base client
 * @param {import("@src/structures").BaseCommand} command the command object
 * @param {string} userId - the user id
 * @returns {number} expiration timestamp (in milliseconds)
 */
function getCooldown(client, command, userId) {
  if (command.cooldown === 0) return 0;

  const timestamps = client.cooldowns.get(command.data.name);
  if (!timestamps) {
    client.cooldowns.set(command.data.name, new Collection());
    return 0;
  }

  const now = Date.now();
  const cooldownAmount = command.cooldown * 1000;

  if (!timestamps.has(userId)) {
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return 0;
  }

  const expirationTime = timestamps.get(userId) + cooldownAmount;
  if (now < expirationTime) {
    return expirationTime - now;
  }

  timestamps.set(userId, now);
  return 0;
}

module.exports = { getCooldown };
