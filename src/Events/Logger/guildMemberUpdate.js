const Discord = require('discord.js');
const Roles = require('../../Schemas/Role');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (oldMember, newMember) => {
    let Cezalarxd = await Utils.CezalariGetir(oldMember);
    Cezalarxd = Cezalarxd.filter(xd => xd.Aktif == true && xd.Tip == "Chat Mute");
    if (Cezalarxd.length > 0) {
    	if (!newMember.roles.cache.has(Settings.chatMuteRol)) await newMember.roles.add(Settings.chatMuteRol)
    };

    ///////////////////////////////////////////////////////////////////////

    await newMember.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => {
      const data = audit.entries.first();
      const target = data.target;
      const executor = data.executor;
      if (executor.bot) return;

      newMember.roles.cache.forEach(async (role) => {
        if (!oldMember.roles.cache.has(role.id)) {
          const Embed = new Discord.MessageEmbed()
          .setAuthor(newMember.displayName, newMember.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
          .setColor(Settings.Color)
          .setTimestamp()
          .setDescription(`${global.emojis.tick} ${target} **-** (\`${target.id}\`) kullanıcısına yeni bir rol eklendi.`)
          .addField(`Ekleyen Kişi`, `${executor} **-** (\`${executor.id}\`)`)
          .addField(`Eklenen Rol`, `${role.toString()} **-** (\`${role.id}\`)`)

          if (newMember.guild.kanalBul('rol-log')) newMember.guild.kanalBul('rol-log').send({ embed: Embed });

          await Roles.findOneAndUpdate({ userID: newMember.user.id }, { userID: newMember.user.id, $push: { Roles: {Rol: role.id, Yetkili: executor.id, Tarih: Date.now(), islem: "Ekleme"} } }, { upsert: true });
        };
      });

      oldMember.roles.cache.forEach(async (role) => {
        if (!newMember.roles.cache.has(role.id)) {
          const Embed = new Discord.MessageEmbed()
          .setAuthor(newMember.displayName, newMember.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
          .setColor(Settings.Color)
          .setTimestamp()
          .setDescription(`${global.emojis.tick} ${target} **-** (\`${target.id}\`) kullanıcısından bir rol alındı.`)
          .addField(`Alan Kişi`, `${executor} **-** (\`${executor.id}\`)`)
          .addField(`Alınan Rol`, `${role.toString()} **-** (\`${role.id}\`)`)

          if (newMember.guild.kanalBul('rol-log')) newMember.guild.kanalBul('rol-log').send({ embed: Embed });

          await Roles.findOneAndUpdate({ userID: newMember.user.id }, { userID: newMember.user.id, $push: { Roles: {Rol: role.id, Yetkili: executor.id, Tarih: Date.now(), islem: "Kaldırma"} } }, { upsert: true });
        };
      });

    });
};

module.exports.config = {
    Event: "guildMemberUpdate"
}
