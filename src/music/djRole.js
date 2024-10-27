const mongoose = require("mongoose");

const djRoleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  roleId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DjRole", djRoleSchema);
