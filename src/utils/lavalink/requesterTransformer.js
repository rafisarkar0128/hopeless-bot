const { User, GuildMember } = require("discord.js");

/**
 * For LavalinkPlayer to transform requester object
 * @typedef {Object} Requester
 * @property {string} id
 * @property {string} username
 * @property {string} [discriminator]
 * @property {string} [avatarURL]
 */

/**
 * A function to transform a requester into a standardized requester object
 * @param {User|GuildMember|object} requester The requester to transform.
 * Can be a user, a member or an object with the keys
 * `id`, `username`, `avatarURL` and `discriminator`.
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
      accentColor: requester.roles.highest.color,
      avatarURL: requester.displayAvatarURL({ size: 1024 }),
      bannerURL: requester.displayBannerURL({ size: 1024 }),
      createdAt: requester.user.createdAt,
      createdTimestamp: requester.user.createdTimestamp,
    };
  }

  return requester;
}

module.exports = { requesterTransformer };
