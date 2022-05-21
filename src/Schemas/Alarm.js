const mongoose = require('mongoose');
const Settings = require('../Configs/Settings.js');

const Alarm = new mongoose.Schema({
  userID: { type: String, default: "" },
  durum: { type: Boolean, default: false },
  sebep: { type: String, default: "" },
  bitis: { type: String, default: "" },
  kanal: { type: String, default: Settings.Channels.Chat },
});

module.exports = mongoose.model('Alarm', Alarm);
