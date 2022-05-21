const mongoose = require('mongoose');
const Settings = require('../Configs/Settings');

const Tag = new mongoose.Schema({
  userID: { type: String, default: "" },
  yetkili: { type: String, default: null },
  members: { type: Array, default: [] }
});

module.exports = mongoose.model('Taggeds', Tag);
