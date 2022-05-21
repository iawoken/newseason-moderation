const mongoose = require('mongoose');

const Register = new mongoose.Schema({
    userID: { type: String, default: "" },
    yetkiliID: { type: String, default: "" },
    Nicknames: { type: Array, default: [] },

    Registers: {
        totalMan: { type: Number, default: 0 },
        totalWoman: { type: Number, default: 0 },
    }
});

module.exports = mongoose.model('Kayıt', Register);