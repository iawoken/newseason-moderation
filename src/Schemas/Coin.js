const mongoose = require('mongoose');

const Coin = new mongoose.Schema({
    userID: { type: String, default: "" },
    coin: { type: Number, default: 0 }
});

module.exports = mongoose.model('Coin', Coin);
