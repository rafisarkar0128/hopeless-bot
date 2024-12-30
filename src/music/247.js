module.exports = {
  name: "247",
  description: "Toggle 24/7 mode (stay in voice channel even when not playing music).",
  execute(message) {
    const player = message.client.manager.get(message.guild.id);

    if (!player) {
      return message.reply("No active session found.");
    }

    const currentSetting = player.get("247") || false;

    if (currentSetting) {
      player.set("247", false);
      return message.reply(
        "24/7 mode is now disabled. The bot will leave when music stops.",
      );
    } else {
      player.set("247", true);
      return message.reply("24/7 mode is now enabled. The bot will stay in the channel.");
    }
  },
};
