const mongoose = require('mongoose');

const Cezalar = new mongoose.Schema({
    ID: { type: Number, default: 1 },
    Aktif: { type: Boolean, default: true },
    userID: { type: String, default: "" },
    yetkiliID: { type: String, default: "" },
    Tip: { type: String, default: "" },
    Sebep: { type: String, default: "Sebep Belirtilmemiş." },
    Kaldiran: { type: String, default: "Kaldırılmamış." },

    Other: {
        Tarih: { type: String, default: "" },
        Sure: { type: String, default: "Yok" },
        Bitis: { type: String, default: "Yok" }
    }
});

module.exports = mongoose.model('Cezalar', Cezalar);