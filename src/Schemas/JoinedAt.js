const mongoose = require("mongoose");

const Channel = mongoose.Schema({
  userID: { type: String, default: "" },
  data: { type: Number, default: 0 },
});

module.exports = mongoose.model("JoinedAt", Channel);
