const { LavalinkManager } = require("lavalink-client");
const { requesterTransformer, autoPlayFunction } = require("@root/src/utils/Utils");

/**
 * A manager to manage music playback and more
 * @extends {LavalinkManager}
 */
class LavalinkClient extends LavalinkManager {
  /**
   * passing client to init LavalinkManager
   * @param {import("./DiscordClient").DiscordClient} client
   */
  constructor(client) {
    super({
      nodes: client.config.music.nodes,
      sendToShard: (guildId, payload) => {
        client.guilds.cache.get(guildId)?.shard?.send(payload);
      },
      autoSkip: true,
      emitNewSongsOnly: false,
      playerOptions: {
        maxErrorsPerTime: {
          threshold: 35000,
          maxAmount: 3,
        },
        minAutoPlayMs: 10_000,
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50,
        defaultSearchPlatform: client.config.music.defaultSearchPlatform,
        requesterTransformer: requesterTransformer,
        onDisconnect: {
          autoReconnect: true,
          destroyPlayer: false,
        },
        onEmptyQueue: {
          destroyAfterMs: client.config.music.idleTime,
          autoPlayFunction: autoPlayFunction,
        },
        useUnresolvedData: true,
      },
      queueOptions: {
        maxPreviousTracks: 25,
      },
      linksAllowed: true,
    });

    /**
     * Base client as a property of the LavalinkClient
     * @type {import("./DiscordClient").DiscordClient}
     */
    this.client = client;
  }

  /**
   * Searches for a track and returns an array of tracks that match the query..
   * @param {import("lavalink-client").SearchQuery} query The query to search for.
   * @param {import("discord.js").User} user The user who requested the search.
   * @returns {Promise<import("lavalink-client").SearchResult>}
   */
  async search(query, user) {
    const nodes = this.nodeManager.leastUsedNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    return await node.search(query, user, false);
  }

  /**
   * Returns an embed color for the provided source
   * @param {import("lavalink-client").SourceNames} source
   * @returns {string}
   */
  getColor(source) {
    const { defaultEmbedColor } = this.client.config.music;
    const { Transparent } = this.client.color;
    const colors = {
      applemusic: "#FA243C",
      bandcamp: "#408294",
      deezer: "#ffed00",
      "flowery-tts": "#fe6287",
      jiosaavn: "#2BC5B4",
      spotify: "#1ED760",
      soundcloud: "#FF5500",
      tidal: "#000000",
      vkmusic: "#0077FF",
      youtube: "#FF0000",
      youtubemusic: "#FF0000",
    };
    return colors[source.toLowerCase()] ?? defaultEmbedColor ?? Transparent;
  }

  /**
   * ! Need Fix (Also in development)
   * A function to fetch lyrics for a track
   * @param {import("lavalink-client").Track} track
   * @param {boolean} skipTrackSource
   */
  async getLyrics(track, skipTrackSource) {
    console.log(track, skipTrackSource);
    const nodes = this.nodeManager.leastUsedNodes();
    const node = nodes.filter((n) => {
      console.log(n.id, n.info.plugins);
      return true;
    });

    return node;
  }
}

module.exports = { LavalinkClient };
