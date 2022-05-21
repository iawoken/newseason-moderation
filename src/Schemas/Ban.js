const mongoose = require('mongoose');

const Ban = new mongoose.Schema({
  userID: { type: String, default: "" },
  Yetkili: { type: String, default: "" },
  Sebep: { type: String, default: "Sebep Belirtilmemiş" }
})

module.exports = mongoose.model('Bans', Ban);
