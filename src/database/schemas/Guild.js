const { Schema, model } = require("mongoose");
const config = require("@config/config.js");
const FixedSizeMap = require("fixedsize-map");
const { getUser } = require("./user.js");

const guildCache = new FixedSizeMap(config.cache_size.guilds);

const schema = new Schema({
  _id: String,
  data: {
    name: String,
    region: String,
    owner: { type: String, ref: "users" },
    joinedAt: Date,
    leftAt: Date,
    bots: { type: Number, default: 0 },
  },
  prefix: {
    type: String,
    default: config.defaultPrefix,
  },
  levels: {
    enabled: Boolean,
    xp: {
      message: {
        type: String,
        default: config.plugins.rank.default_level_up_message,
      },
      channel: String,
    },
  },
  ticket: {
    log_channel: String,
    limit: { type: Number, default: 10 },
    categories: [
      {
        _id: false,
        name: String,
        staff_roles: [String],
      },
    ],
  },
  automod: {
    debug: Boolean,
    strikes: { type: Number, default: 10 },
    action: { type: String, default: "TIMEOUT" },
    wh_channels: [String],
    anti_attachments: Boolean,
    anti_invites: Boolean,
    anti_links: Boolean,
    anti_spam: Boolean,
    anti_ghostping: Boolean,
    anti_massmention: Number,
    max_lines: Number,
  },
  invite: {
    tracking: Boolean,
    ranks: [
      {
        invites: { type: Number, required: true },
        _id: { type: String, required: true },
      },
    ],
  },
  flag_translation: {
    enabled: Boolean,
  },
  modlog_channel: String,
  max_warn: {
    action: {
      type: String,
      enum: ["TIMEOUT", "KICK", "BAN"],
      default: "KICK",
    },
    limit: { type: Number, default: 5 },
  },
  counters: [
    {
      _id: false,
      counter_type: String,
      name: String,
      channel_id: String,
    },
  ],
  welcome: {
    enabled: Boolean,
    channel: String,
    content: String,
    embed: {
      description: String,
      color: String,
      thumbnail: Boolean,
      footer: String,
      image: String,
    },
  },
  farewell: {
    enabled: Boolean,
    channel: String,
    content: String,
    embed: {
      description: String,
      color: String,
      thumbnail: Boolean,
      footer: String,
      image: String,
    },
  },
  autorole: {
    bot: [String],
    member: [String],
  },
  suggestions: {
    enabled: Boolean,
    channel_id: String,
    approved_channel: String,
    rejected_channel: String,
    staff_roles: [String],
  },
});

const Model = model("guild", schema);

/**
 * @param {import('discord.js').Guild} guild
 * @return {Promise<import("mongoose").Document<schema>>}
 */
async function getSettings(guild) {
  if (!guild) throw new Error("Guild is undefined");
  if (!guild.id) throw new Error("Guild Id is undefined");

  const cachedData = guildCache.get(guild.id);
  if (cachedData) return cachedData;

  let guildData = await Model.findById(guild.id);
  if (!guildData) {
    guild
      .fetchOwner()
      .then(async (owner) => {
        const userDb = await getUser(owner);
        await userDb.save();
      })
      .catch((ex) => {});

    guildData = new Model({
      _id: guild.id,
      data: {
        name: guild.name,
        region: guild.preferredLocale,
        owner: guild.ownerId,
        joinedAt: guild.joinedAt,
      },
    });

    await guildData.save();
  }
  guildCache.add(guild.id, guildData);
  return guildData;
}

module.exports = { model: model, getSettings };
