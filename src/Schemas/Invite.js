const mongoose = require('mongoose');

const Invite = new mongoose.Schema({
    userID: { type: String, default: "" },
    toplam: { type: Number, default: 0 },
    members: { type: Array, default: [] }
});

module.exports = mongoose.model('Invite', Invite);
