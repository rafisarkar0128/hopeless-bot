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

/**
 * A function to add new songs to an empty queue if autoplay feature is enabled
 * @param {import("lavalink-client").Player} player The player instance.
 * @param {import("lavalink-client").Track} lastTrack The last played track.
 * @returns {Promise<void>}
 */
async function autoPlayFunction(player, lastTrack) {
  if (!player.get("autoplay")) return;
  if (!lastTrack) return;

  if (lastTrack.info.sourceName === "spotify") {
    const filtered = player.queue.previous
      .filter((t) => t.info.sourceName === "spotify")
      .slice(0, 5);

    const ids = filtered.map(
      (t) =>
        t.info.identifier ||
        t.info.uri.split("/")?.reverse()?.[0] ||
        t.info.uri.split("/")?.reverse()?.[1]
    );

    if (ids.length >= 2) {
      const response = await player.search(
        {
          query: `seed_tracks=${ids.join(",")}`,
          source: "sprec",
        },
        lastTrack.requester
      );
      //`&seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`,

      // remove the lastPlayed track if it's in there.
      response.tracks = response.tracks.filter(
        (t) => t.info.identifier !== lastTrack.info.identifier
      );
      console.log(response.tracks);

      if (response && response.tracks.length > 0) {
        await player.queue.add(
          response.tracks.slice(0, 5).map((track) => {
            // transform the track plugininfo so you can figure out if the track is from autoplay or not.
            track.pluginInfo.clientData = {
              ...(track.pluginInfo.clientData || {}),
              fromAutoplay: true,
            };
            return track;
          })
        );
      }
    }
    return;
  }

  if (["youtube", "youtubemusic"].includes(lastTrack.info.sourceName)) {
    const response = await player.search(
      {
        query: `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`,
        source: "youtube",
      },
      lastTrack.requester
    );

    response.tracks = response.tracks.filter(
      (t) => t.info.identifier !== lastTrack.info.identifier
    );

    if (response && response.tracks.length > 0) {
      await player.queue.add(
        response.tracks.slice(0, 5).map((track) => {
          // transform the track plugininfo so you can figure out if the track is from autoplay or not.
          track.pluginInfo.clientData = {
            ...(track.pluginInfo.clientData || {}),
            fromAutoplay: true,
          };
          return track;
        })
      );
    }
    return;
  }

  if (lastTrack.info.sourceName === "jiosaavn") {
    const response = await player.search(
      { query: `jsrec:${lastTrack.info.identifier}`, source: "jsrec" },
      lastTrack.requester
    );

    if (response && response.tracks.length > 0) {
      const track = response.tracks.filter(
        (t) => t.info.identifier !== lastTrack.info.identifier
      )[0];
      await player.queue.add(track);
    }
  }
}

module.exports = { requesterTransformer, autoPlayFunction };
