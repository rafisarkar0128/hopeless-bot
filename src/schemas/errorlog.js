const { Schema, model } = require("mongoose");
const errorLogSchema = new Schema({
    guild: String,
    channel: String,
    enabled: String,
});

module.exports = model("errorlog", errorLogSchema);
