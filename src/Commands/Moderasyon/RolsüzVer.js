const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Database = require('../../Schemas/AcilmazBan');
const table = require('table')

module.exports = {
    name: "rolsüzver",
    aliases: ['rolsüz-ver', 'rolsuzver'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
    if (!Settings.banHammer.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});
    const type = args[0];
    let RolsuzMembers = message.guild.members.cache.filter(x => (x.roles.cache.size) == 1).array();
    if (!type) return message.inlineReply(`Sunucuda rolü olmayan (\`${RolsuzMembers.length}\`) kişi bulunuyor. Bu kişilere kayıtsız rolü vermek için __[ rolsüz ver ]__ komutunu kullanın.\n────────────\n${RolsuzMembers.length < 30 ? RolsuzMembers.join(",") : `Sunucuda 30 kişiden fazla rolsüz olduğu için sadece 30 kişiyi gösterebilirim.\n${RolsuzMembers.slice(0, 30).join(",")}`}`);
    else if (["ver", "dağıt"].includes(type)) {
        RolsuzMembers.forEach((member, index) => {
            setTimeout(() => {
                member.roles.add(Settings.unregisterRol).catch();
            }, index * 750)
        });
    };
  }
}
