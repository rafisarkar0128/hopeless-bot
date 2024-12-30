//dj system

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "enable_dj") {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "Only the server owner can enable the DJ system.",
        ephemeral: true,
      });
    }

    client.djEnabled.set(interaction.guild.id, true);
    return interaction.reply({ content: "DJ system enabled.", ephemeral: true });
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "disable_dj") {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "Only the server owner can disable the DJ system.",
        ephemeral: true,
      });
    }

    client.djEnabled.set(interaction.guild.id, false);
    return interaction.reply({ content: "DJ system disabled.", ephemeral: true });
  }
});
///lava music
const { Manager } = require("erela.js");
const lavalinkNodes = [
  {
    host: "Your_lavalink_host",
    port: your_port_here,
    password: "Lavalink_host_password",
    secure: true, //set this based on your host connection :)
  },
];

client.manager = new Manager({
  nodes: lavalinkNodes,
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.manager.on("nodeConnect", (node) => {
  console.log(`Node ${node.options.identifier} connected.`);
});

client.manager.on("nodeError", (node, error) => {
  console.error(`Node ${node.options.identifier} had an error: ${error.message}`);
});

client.manager.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  //channel.send(`Now playing: ${track.title}`);
});

client.manager.on("queueEnd", (player) => {
  const channel = client.channels.cache.get(player.textChannel);
  channel.send("Queue has ended.");
  player.destroy();
});

client.on("ready", () => {
  console.log(`${client.user.tag} is now online!`);
  client.manager.init(client.user.id);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

//prefix handler...
// events/messageCreate.js
///

client.on("messageCreate", async (message) => {
  // Ignore messages from bots or those without the prefix
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  // Extract command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const prefixCommandName = args.shift().toLowerCase();

  // Helper function to recursively find all command files in a directory
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      } else if (file.endsWith(".js")) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    });

    return arrayOfFiles;
  };

  // Get all prefix command files in prefixCommands and subdirectories
  const prefixCommandFiles = getAllFiles(path.join(__dirname, "./prefixCommands"));

  // Find and execute the prefixCommand
  let prefixCommandFound = false;
  for (const file of prefixCommandFiles) {
    const prefixCommand = require(file);

    if (prefixCommand.name === prefixCommandName) {
      prefixCommandFound = true;
      try {
        // Execute the prefixCommand
        prefixCommand.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command.");
      }
      break;
    }
  }

  // If prefixCommand is not found
  if (!prefixCommandFound) {
    message.reply("That command does not exist.");
  }
});
