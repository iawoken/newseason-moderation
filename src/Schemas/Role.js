const mongoose = require('mongoose');

const Role = new mongoose.Schema({
  userID: { type: String, default: "" },
  Roles: { type: Array, default: [] }
});

module.exports = mongoose.model('Roles', Role);
