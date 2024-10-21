/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "queueEnd",
  once: false,
  riffy: true,
  /**
   * types for parameters
   * @param {import("riffy").Player} player
   */
  execute: async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);

    // Set this to true if you want to enable autoplay.
    const autoplay = true;

    if (autoplay) {
      player.autoplay(player);
    } else {
      player.destroy();
      channel.send("Queue has ended.");
    }
  },
};
