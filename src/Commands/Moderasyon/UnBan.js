const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Database = require('../../Schemas/Ceza');
const table = require('table')

module.exports = {
    name: "unban",
    aliases: ['un-ban'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (!Settings.banHammer.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});
if (!args[0]) return message.inlineReply("ibidi patron");
let reasonn = args.slice(1).join(" ") || "Sebep Girilmedi";
message.guild.fetchBan(args[0]).then(async ({ user, reason }) => {
let Data = await Database.find({Activity: true, userID: user.id, Type: "Ban" });
if ((Data.length <= 0)) {};
Data.forEach(x => {
x.Activity = false;
x.save();
});
message.guild.members.unban(user.id, `tarafından banı açıldı.`);  
message.channel.send(user.tag + " adlı kullanıcının yasağı kaldırıldı.")
});
}
}
