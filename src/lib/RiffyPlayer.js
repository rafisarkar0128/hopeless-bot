const { Riffy } = require("riffy");

class RiffyPlayer extends Riffy {
  /**
   * client parameter to access config files and other property
   * @param {import("./DiscordBot.js").DiscordBot} client
   */
  constructor(client) {
    super(client, client.config.plugins.music.lavalink_nodes, {
      send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
      },
      defaultSearchPlatform: "ytmsearch",
      restVersion: "v4", // Or "v3" based on your Lavalink version.
    });
  }
}

//client.on("messageCreate", async (message) => {
//  if (!message.content.startsWith("!") || message.author.bot) return;
//
//  const args = message.content.slice(1).trim().split(" ");
//  const command = args.shift().toLowerCase();
//
//  if (command === "play") {
//
//  }
//});

//// This will send log when the lavalink node is connected.
//client.riffy.on("nodeConnect", (node) => {
//  console.log(`Node "${node.name}" connected.`);
//});
//
//// This will send log when the lavalink node faced an error.
//client.riffy.on("nodeError", (node, error) => {
//  console.log(`Node "${node.name}" encountered an error: ${error.message}.`);
//});
//

module.exports = { RiffyPlayer };
