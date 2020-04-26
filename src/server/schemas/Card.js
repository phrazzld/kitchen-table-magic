const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  png: { type: String, required: true },
});

module.exports = mongoose.model("Card", CardSchema);
