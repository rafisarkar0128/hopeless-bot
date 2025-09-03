/**
 * A function to add new songs to an empty queue if autoplay feature is enabled
 * @param {import("lavalink-client").Player} player The player instance.
 * @param {import("lavalink-client").Track} lastTrack The last played track.
 * @returns {Promise<void>}
 */
async function handleAutoplay(player, lastTrack) {
  if (!player.get("autoplay")) return;
  if (!lastTrack) return;

  /**
   * Helper to search and add autoplay tracks for a given source
   * @param {import("lavalink-client").SearchQuery} searchParams The search parameters.
   * @returns {Promise<void>}
   */
  async function autoplaySearch(searchParams) {
    const response = await player.search(searchParams, lastTrack.requester);
    if (response && response.tracks?.length > 0) {
      const tracks = response.tracks.filter((t) => t.info.identifier !== lastTrack.info.identifier);
      if (tracks.length > 0) {
        await player.queue.add(
          tracks.slice(0, 5).map((track) => {
            track.pluginInfo.clientData = {
              ...(track.pluginInfo.clientData || {}),
              fromAutoplay: true,
            };
            return track;
          })
        );
      }
    }
  }

  if (lastTrack.info.sourceName === "spotify") {
    const filtered = player.queue.previous
      .filter((t) => t.info.sourceName === "spotify")
      .slice(0, 5);

    // Extract track IDs
    const trackIds = filtered
      .map((t) => {
        let id = t.info.identifier;
        if (!id && t.info.uri) {
          if (t.info.uri.startsWith("spotify:track:")) {
            id = t.info.uri.split(":").pop();
          } else if (t.info.uri.includes("/track/")) {
            id = t.info.uri.split("/track/")[1]?.split("?")[0];
          }
        }
        return id;
      })
      .filter(Boolean);

    return await autoplaySearch({
      query: `seed_tracks=${trackIds.join(",")}`,
      source: "sprec",
    });
  }

  if (["youtube", "youtubemusic"].includes(lastTrack.info.sourceName)) {
    return await autoplaySearch({
      query: `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`,
      source: "youtube",
    });
  }

  if (lastTrack.info.sourceName === "jiosaavn") {
    return await autoplaySearch({
      query: `jsrec:${lastTrack.info.identifier}`,
      source: "jsrec",
    });
  }

  if (lastTrack.info.sourceName === "soundcloud") {
    return await autoplaySearch({
      query: `screc:${lastTrack.info.identifier}`,
      source: "screc",
    });
  }

  if (lastTrack.info.sourceName === "deezer") {
    return await autoplaySearch({
      query: `dzrec:${lastTrack.info.identifier}`,
      source: "dzrec",
    });
  }

  if (lastTrack.info.sourceName === "tidal") {
    return await autoplaySearch({
      query: `tdrec:${lastTrack.info.identifier}`,
      source: "tdrec",
    });
  }

  if (lastTrack.info.sourceName === "qobuz") {
    return await autoplaySearch({
      query: `qbrec:${lastTrack.info.identifier}`,
      source: "qbrec",
    });
  }

  if (lastTrack.info.sourceName === "vk") {
    return await autoplaySearch({
      query: `vkrec:${lastTrack.info.identifier}`,
      source: "vkrec",
    });
  }

  if (lastTrack.info.sourceName === "yandexmusic") {
    return await autoplaySearch({
      query: `ymrec:${lastTrack.info.identifier}`,
      source: "ymrec",
    });
  }
}

module.exports = { handleAutoplay };
