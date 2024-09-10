const { ChannelType } = require("discord.js");

async function getChannelCountString(Channels) {
  const ChannelString = `Categories: ${
    Channels.filter((c) => c.type === ChannelType.GuildCategory).size
  } | Text: ${
    Channels.filter((c) => c.type === ChannelType.GuildText).size
  } | Voice: ${
    Channels.filter((c) => c.type === ChannelType.GuildVoice).size
  } | Announcement: ${
    Channels.filter((c) => c.type === ChannelType.GuildAnnouncement).size
  } | Stage: ${
    Channels.filter((c) => c.type === ChannelType.GuildStageVoice).size
  } | Forum: ${
    Channels.filter((c) => c.type === ChannelType.GuildForum).size
  } | Media: ${
    Channels.filter((c) => c.type === ChannelType.GuildMedia).size
  } | Directory: ${
    Channels.filter((c) => c.type === ChannelType.GuildDirectory).size
  }`;

  return ChannelString;
}

module.exports = { getChannelCountString };
