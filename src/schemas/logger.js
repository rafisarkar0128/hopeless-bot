const { Schema, model } = require("mongoose");

const LoggerSchema = new Schema({
  _id: String,
  enabled: Boolean,
  data: {
    created_by: String,
    created_for: String,
    created_on: Date,
    last_updated_on: Date,
  },
  mention: {
    enabled: Boolean,
    roles: [String],
    mention_on: {
      general: Boolean,
      error: Boolean,
      join: Boolean,
      leave: Boolean,
      command: Boolean,
      music: Boolean,
    },
  },
  channels: {
    general: String,
    error: String,
    join: String,
    leave: String,
    command: String,
    music: String,
  },
});

const logger = new model("logger", LoggerSchema);

module.exports = { logger };
