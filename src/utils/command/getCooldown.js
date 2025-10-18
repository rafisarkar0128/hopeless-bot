const { Collection } = require("discord.js");

/**
 * A function to set, get and delete command cooldowns
 * @param {Collection<string, Collection<string, number>>} cooldowns - The cooldowns collection
 * @param {import("@structures/index").BaseCommand} command - The command object
 * @param {string} userId - The user id
 * @returns {number} expiration timestamp (in milliseconds)
 */
function getCooldown(cooldowns, command, userId) {
  if (command.options.cooldown === 0) return 0;

  const timestamps = cooldowns.get(command.data.name);
  if (!timestamps) {
    cooldowns.set(command.data.name, new Collection());
    return 0;
  }

  const now = Date.now();
  const cooldownAmount = command.options.cooldown * 1000;

  if (!timestamps.has(userId)) {
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return 0;
  }

  const expirationTime = timestamps.get(userId) + cooldownAmount;
  if (now < expirationTime) return expirationTime - now;

  timestamps.set(userId, now);
  return 0;
}

module.exports = { getCooldown };
