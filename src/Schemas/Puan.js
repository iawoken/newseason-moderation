const mongoose = require('mongoose');
const Settings = require('../Configs/Settings');

const Puan = new mongoose.Schema({
  userID: { type: String, default: "" },
  Yetki: { type: String, default: "" },
  Puan: { type: Number, default: 0 }
})

module.exports = mongoose.model('Puan', Puan);
