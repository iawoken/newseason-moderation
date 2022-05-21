const mongoose = require('mongoose');
const Settings = require('../Configs/Settings');

const Awo = new mongoose.Schema({
  userID: { type: String, default: "" },
  
  parentID: { type: String, default: ""},
  parentData: { type: Number, default: 0}
})

module.exports = mongoose.model('Orspuibidi', Awo);
