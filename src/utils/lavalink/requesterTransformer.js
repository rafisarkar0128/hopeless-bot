const { User, GuildMember } = require("discord.js");

/**
 * For LavalinkPlayer to transform requester object.
 * @typedef {Object} Requester
 * @property {string} id - The ID of the requester
 * @property {string} username - The username of the requester
 * @property {string} tag - The tag of the requester
 * @property {string} [globalName] - The global name of the requester
 * @property {number} [accentColor] - The accent color of the Requester.
 * @property {string} discriminator - The discriminator of the requester
 * @property {string} avatarURL - The avatar URL of the requester - 1024 size
 * @property {string} [bannerURL] - The banner URL of the requester - 1024 size
 * @property {Date} createdAt - The creation date of the requester
 * @property {number} createdTimestamp - The creation timestamp of the requester
 */

/**
 * A function to transform a requester into a standardized requester object
 * @param {User|GuildMember|object} requester The requester to transform.
 * Can be a user, a member or an object with the keys
 * that match the discord.js User or GuildMember class.
 * @returns {Requester} The transformed requester object.
 */
function requesterTransformer(requester) {
  if (requester instanceof User) {
    return {
      id: requester.id,
      username: requester.username,
      discriminator: requester.discriminator,
      tag: requester.tag,
      globalName: requester.globalName,
      accentColor: requester.accentColor,
      avatarURL: requester.avatarURL({ size: 1024 }),
      bannerURL: requester.bannerURL({ size: 1024 }),
      createdAt: requester.createdAt,
      createdTimestamp: requester.createdTimestamp,
    };
  }

  if (requester instanceof GuildMember) {
    return {
      id: requester.id,
      username: requester.user.username,
      discriminator: requester.user.discriminator,
      tag: requester.user.tag,
      globalName: requester.user.globalName,
      accentColor: requester.displayColor,
      avatarURL: requester.displayAvatarURL({ size: 1024 }),
      bannerURL: requester.displayBannerURL({ size: 1024 }),
      createdAt: requester.user.createdAt,
      createdTimestamp: requester.user.createdTimestamp,
    };
  }

  return requester;
}

module.exports = { requesterTransformer };
