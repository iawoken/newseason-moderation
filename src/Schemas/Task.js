const mongoose = require('mongoose');
const Settings = require('../Configs/Settings.js');

const Task = new mongoose.Schema({
  userID: { type: String, default: "" },
  durum: { type: Boolean, default: true },
  tamamlandi: { type: Boolean, default: false },
  tamamlanan: { type: Number, default: 0 },
  hedef: { type: Number, default: 0 },
  puan: { type: Number, default: 100 },
  tur: { type: String, default: "" },
  gorevText: { type: String, default: "" },
  tarih: { type: Number, default: Date.now() },
  bitis: { type: Number, default: Date.now() },
});

module.exports = mongoose.model('Task', Task);
