const { model, Schema } = require(`mongoose`);

let welcomeSchema = new Schema({
  guildid: String,
  channel: String,
  message: String,
  imageURL: String, // Add imageURL property
});

module.exports = model(`welcomeSchema`, welcomeSchema);
