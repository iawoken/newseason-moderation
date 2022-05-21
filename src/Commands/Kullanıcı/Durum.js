const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const ms = require('ms');

module.exports = {
    name: "durum",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});

      let totalmem = message.guild.members.cache.size;
      let unregisters = message.guild.members.cache.filter(mem => Settings.unregisterRol.some(perm => mem.roles.cache.has(perm))).size;
      let tags = message.guild.members.cache.filter(mem => Utils.TagKontrol(mem) == true).size;
      let online = message.guild.members.cache.filter(mem => mem.presence.status !== "offline").size;

      return message.inlineReply(`${Settings.Sunucuadi} toplam **${totalmem}** üyeye sahip. %${parseInt(((totalmem - unregisters) / totalmem) * 100)} kayıtlı, %${parseInt((unregisters / totalmem) * 100)} kayıtsız, %${parseInt((online / totalmem) * 100)} aktif ve %${parseInt((tags / totalmem) * 100)} taglı.`);
    }
};
