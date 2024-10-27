const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const Genius = require("genius-lyrics");
const Client = new Genius.Client(
  "pR0M5dWximO3ai5KRSYgiV8UK__hwHR_m4hgdy_1TaImm8zop_SE6KO5GnoTvW9",
);
const DjRole = require("../../schemas/djRole");
const DjMode = require("../../schemas/djMode");

module.exports = {
  name: "play",
  description: "Play music using Lavalink",

  async execute(message, args) {
    const guildId = message.guild.id;
    const djRoleData = await DjRole.findOne({ guildId });
    let djModeData = await DjMode.findOne({ guildId });
    let djModeEnabled = djModeData ? djModeData.enabled : false;

    if (!message.member.voice.channel) {
      return message.reply("You need to be in a voice channel to play music.");
    }

    if (!args.length) return message.reply("Please provide a song name or URL.");

    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });

    await player.connect();

    let search = args.join(" ");
    const res = await message.client.manager.search(search, message.author);

    if (res.loadType === "NO_MATCHES") {
      return message.reply("No results found.");
    }

    player.queue.add(res.tracks[0]);
    if (!player.playing && !player.paused && !player.queue.size) {
      player.play();
    }

    const embed = new EmbedBuilder()
      .setTitle(`Now playing: ${res.tracks[0].title}`)
      .setDescription(`Requested by ${message.author.username}`)
      .setThumbnail(res.tracks[0].thumbnail)
      .setColor(0x1d82b6);

    const qualityMenu = new StringSelectMenuBuilder()
      .setCustomId("song-quality")
      .setPlaceholder("Select song quality")
      .addOptions([
        {
          label: "Low",
          value: "low",
          emoji: "🔇",
        },
        {
          label: "Medium",
          value: "medium",
          emoji: "💡",
        },
        {
          label: "High",
          value: "high",
          emoji: "🔊",
        },
      ]);
    const row4 = new ActionRowBuilder().addComponents(qualityMenu);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("resume")
        .setLabel("Resume")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("loop")
        .setLabel("Loop")
        .setStyle(ButtonStyle.Primary),
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("Shuffle")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("clear_queue")
        .setLabel("Clear Queue")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("vote_skip")
        .setLabel("Vote to Skip")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("dj_mode")
        .setLabel("DJ Mode")
        .setStyle(ButtonStyle.Success)
        .setDisabled(!message.member.permissions.has("MANAGE_GUILD")), // Only server managers can toggle DJ mode
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("volume_up")
        .setLabel("Volume Up")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("volume_down")
        .setLabel("Volume Down")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("lyrics")
        .setLabel("Lyrics")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("seek")
        .setLabel("Seek")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("view_queue")
        .setLabel("View Queue")
        .setStyle(ButtonStyle.Secondary),
    );

    message.channel.send({ embeds: [embed], components: [row4, row3, row, row2] });

    const collector = message.channel.createMessageComponentCollector({ time: 600000 });

    collector.on("collect", async (interaction) => {
      if (
        djModeEnabled &&
        djRoleData &&
        !interaction.member.roles.cache.has(djRoleData.roleId)
      ) {
        return interaction.reply({
          content: "Only users with the DJ role can use these buttons.",
          ephemeral: true,
        });
      }

      switch (interaction.customId) {
        case "skip":
          player.stop();
          interaction.reply({ content: "Skipped the track.", ephemeral: true });
          break;
        case "stop":
          player.destroy();
          interaction.reply({ content: "Stopped the music.", ephemeral: true });
          break;
        case "pause":
          if (!player.paused) {
            player.pause(true);
            interaction.reply({ content: "Paused the music.", ephemeral: true });
          } else {
            interaction.reply({ content: "Music is already paused.", ephemeral: true });
          }
          break;
        case "resume":
          if (player.paused) {
            player.pause(false);
            interaction.reply({ content: "Resumed the music.", ephemeral: true });
          } else {
            interaction.reply({ content: "Music is already playing.", ephemeral: true });
          }
          break;
        case "loop":
          player.setTrackRepeat(!player.trackRepeat);
          interaction.reply({
            content: `Looping is now ${player.trackRepeat ? "enabled" : "disabled"}.`,
            ephemeral: true,
          });
          break;
        case "shuffle":
          player.queue.shuffle();
          interaction.reply({ content: "Shuffled the queue.", ephemeral: true });
          break;
        case "clear_queue":
          player.queue.clear();
          interaction.reply({ content: "Cleared the queue.", ephemeral: true });
          break;
        case "vote_skip":
          const vote = await initiateVoteToSkip(message, player);
          interaction.reply({ content: `Vote result: ${vote}`, ephemeral: true });
          break;
        case "volume_up":
          player.setVolume(Math.min(player.volume + 10, 100));
          interaction.reply({
            content: `Volume increased to ${player.volume}.`,
            ephemeral: true,
          });
          break;
        case "volume_down":
          player.setVolume(Math.max(player.volume - 10, 0));
          interaction.reply({
            content: `Volume decreased to ${player.volume}.`,
            ephemeral: true,
          });
          break;
        case "lyrics":
          const lyrics = await getLyrics(res.tracks[0].title);
          interaction.reply({
            content: `Lyrics for **${res.tracks[0].title}**:\n\n${
              lyrics || "No lyrics found."
            }`,
            ephemeral: true,
          });
          break;
        case "seek":
          player.seek(60000); // Seek to 1 minute
          interaction.reply({ content: "Seeked to 1 minute.", ephemeral: true });
          break;
        case "view_queue":
          interaction.reply({
            content: `Current queue:\n${player.queue
              .map((t, i) => `${i + 1}. ${t.title}`)
              .join("\n")}`,
            ephemeral: true,
          });
          break;
        case "song-quality":
          const selectedQuality = interaction.values[0];
          interaction.reply({
            content: `Selected song quality: **${selectedQuality}**`,
            ephemeral: true,
          });
          break;
        case "dj_mode":
          djModeEnabled = !djModeEnabled;
          if (!djModeData) {
            djModeData = new DjMode({ guildId, enabled: djModeEnabled });
          } else {
            djModeData.enabled = djModeEnabled;
          }
          await djModeData.save();
          interaction.reply({
            content: `DJ mode has been ${djModeEnabled ? "enabled" : "disabled"}.`,
            ephemeral: true,
          });
          break;
      }
    });
    console.log("Tracks found:", res.tracks);
    console.log("Adding track:", res.tracks[0].title);

    async function initiateVoteToSkip(message, player) {
      const voteCount = Math.floor(Math.random() * 10);
      return voteCount > 5 ? "Skipped" : "Not skipped";
    }

    async function getLyrics(songTitle) {
      try {
        const searches = await Client.songs.search(songTitle);
        const firstSong = searches[0];
        const lyrics = await firstSong.lyrics();
        return lyrics;
      } catch (error) {
        return null;
      }
    }
  },
};
