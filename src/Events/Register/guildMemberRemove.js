const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (member) => {
    if (member.user.bot) return;
    const Registerfln = require('../../Schemas/Register.js');
    let RegisterData = await Registerfln.findOne({ userID: member.user.id });
    if (!RegisterData) return;

    if(Settings.erkekRol.some(rol => member.roles.cache.has(rol)) || Settings.kizRol.some(rol => member.roles.cache.has(rol))) {
        let RData = RegisterData.Nicknames || [];
        RData = RData.sort((a, b) => Number(b.tarih) - Number(a.tarih));
        
        if (RData.length <= 0) return
        else RData = RData[0];
        
        await Registerfln.findOneAndUpdate({ userID: member.user.id }, { $push: {Nicknames: {tarih: Date.now(), isim: RData.isim, yas: RData.yas, fullname: RData.fullname, cinsiyet: "Yok", islem: 'Sunucudan Ayrılma'} }}, {upsert: true});
    } else return;
};

module.exports.config = {
    Event: "guildMemberRemove"
}