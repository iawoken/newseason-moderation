const mongoose = require('mongoose');

const Notes = new mongoose.Schema({
    userID: { type: String, default: "" },
    Notes: { type: Array, default: [] }
});

module.exports = mongoose.model('Notes', Notes);
