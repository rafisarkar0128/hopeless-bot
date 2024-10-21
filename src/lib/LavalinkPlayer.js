const { LavalinkManager } = require("lavalink-client");

class LavalinkPlayer extends LavalinkManager {
  /**
   * Base client
   * @param {import("./DiscordBot").DiscordBot} client
   */
  constructor(client) {
    super({
      nodes: client.config.plugins.music.lavalink_nodes,
      sendToShard: (guildId, payload) =>
        client.guilds.cache.get(guildId)?.shard?.send(payload),
      autoSkip: true,
      emitNewSongsOnly: true,
      playerOptions: {
        maxErrorsPerTime: {
          threshold: 10_000,
          maxAmount: 3,
        },
        minAutoPlayMs: 10_000,
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50,
        defaultSearchPlatform: client.config.plugins.music.search_engine,
        requesterTransformer: requesterTransformer,
        onDisconnect: {
          autoReconnect: true,
          destroyPlayer: false,
        },
        onEmptyQueue: {
          destroyAfterMs: 30_000,
          autoPlayFunction: autoPlayFunction,
        },
        useUnresolvedData: true,
      },
      queueOptions: {
        maxPreviousTracks: 25,
      },
      linksAllowed: true,
    });
  }
}

/**
 * types for requesterTransformer function
 * @typedef {object} Requester
 * @property {string} [id]
 * @property {string} [username]
 * @property {string} [discriminator]
 * @property {string} [avatarURL]
 */
/**
 * A function to transform a requester into a standardized requester object
 * @param {any} requester The requester to transform.
 * Can be a string, a user, or an object with the keys `id`, `username`, and `avatarURL`.
 * @returns {Requester} The transformed requester object.
 */
function requesterTransformer(requester) {
  if (
    typeof requester === "object" &&
    "avatar" in requester &&
    Object.keys(requester).length === 3
  ) {
    return requester;
  }

  if (typeof requester === "object" && "displayAvatarURL" in requester) {
    return {
      id: requester.id,
      username: requester.username,
      avatarURL: requester.displayAvatarURL({ extension: "png" }),
      discriminator: requester.discriminator,
    };
  }

  return { id: requester.toString(), username: "unknown" };
}

/**
 * A function to add new songs to an empty queue if autoplay feature is enabled
 * @param {import("lavalink-client").Player} player The player instance.
 * @param {import("lavalink-client").Track} lastTrack The last played track.
 * @returns {Promise<void>} A promise that resolves when the function is done.
 */
async function autoPlayFunction(player, lastTrack) {
  if (!player.get("autoplay")) return;
  if (!lastTrack) return;

  if (lastTrack.info.sourceName === "spotify") {
    const filtered = player.queue.previous
      .filter((v) => v.info.sourceName === "spotify")
      .slice(0, 5);
    const ids = filtered.map(
      (v) =>
        v.info.identifier ||
        v.info.uri.split("/")?.reverse()?.[0] ||
        v.info.uri.split("/")?.reverse()?.[1],
    );

    if (ids.length >= 2) {
      const res = await player
        .search(
          {
            query: `seed_tracks=${ids.join(",")}`,
            source: "sprec",
          },
          lastTrack.requester,
        )
        .then((response) => {
          response.tracks = response.tracks.filter(
            (v) => v.info.identifier !== lastTrack.info.identifier,
          );

          return response;
        })
        .catch(console.warn);

      if (res && res.tracks.length > 0)
        await player.queue.add(
          res.tracks.slice(0, 5).map((track) => {
            track.pluginInfo.clientData = {
              ...(track.pluginInfo.clientData || {}),
              fromAutoplay: true,
            };
            return track;
          }),
        );
    }

    return;
  }

  if (
    lastTrack.info.sourceName === "youtube" ||
    lastTrack.info.sourceName === "youtubemusic"
  ) {
    const res = await player
      .search(
        {
          query: `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`,
          source: "youtube",
        },
        lastTrack.requester,
      )
      .then((response) => {
        response.tracks = response.tracks.filter(
          (v) => v.info.identifier !== lastTrack.info.identifier,
        );

        return response;
      })
      .catch(console.warn);

    if (res && res.tracks.length > 0)
      await player.queue.add(
        res.tracks.slice(0, 5).map((track) => {
          track.pluginInfo.clientData = {
            ...(track.pluginInfo.clientData || {}),
            fromAutoplay: true,
          };

          return track;
        }),
      );

    return;
  }

  if (lastTrack.info.sourceName === "jiosaavn") {
    const res = await player.search(
      { query: `jsrec:${lastTrack.info.identifier}`, source: "jsrec" },
      lastTrack.requester,
    );

    if (res.tracks.length > 0) {
      const track = res.tracks.filter(
        (v) => v.info.identifier !== lastTrack.info.identifier,
      )[0];
      await player.queue.add(track);
    }
  }

  return;
}

module.exports = { LavalinkPlayer };
