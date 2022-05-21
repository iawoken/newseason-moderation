const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Taggeds = require('../../Schemas/Taggeds.js')
const Tasks = require('../../Schemas/Task');
const moment = require('moment');
moment.locale('tr');

module.exports = {
    name: "profil",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      const status = {
        offline: "Çevrimdışı",
        online: "Çevrimiçi",
        dnd: "Rahatsız Etmeyin",
        idle: "Boşta"
      };

      const platforms = [];
      if (member.presence.clientStatus && member.presence.clientStatus.desktop ? true : false) platforms.push(`Masaüstü Uygulama`);
      if (member.presence.clientStatus && member.presence.clientStatus.mobile ? true : false) platforms.push(`Cep Telefonu`);
      if (member.presence.clientStatus && member.presence.clientStatus.web ? true : false) platforms.push(`İnternet Tarayıcısı`);

      const toplamKayit = await Utils.toplamKayıt(member) || 0;
      const registeredMems = await Utils.toplamKayıt(member, { getir: "members" }).then(xx => xx.filter(xd => message.guild.members.cache.has(xd.userID))) || [];
      const defRegs = await Utils.toplamKayıt(member, { getir: "total" });
      const Tagged = await Taggeds.findOne({ userID: member.id });
      let Tags = 0;
      if (Tagged) Tags = Tagged.members.length;

      const Task = await Tasks.find({ userID: message.member.id });
      const Cezaxd = require('../../Schemas/Ceza');
      const Cezacik = await Cezaxd.find({ yetkiliID: member.id });

      let Datas = [
        { name: "Yasaklama", data: Cezacik.filter(C => C.Tip == "Ban").length },
        { name: "Jail", data: Cezacik.filter(C => C.Tip == "Jail").length },
        { name: "Chat Mute", data: Cezacik.filter(C => C.Tip == "Chat Mute").length },
        { name: "Voice Mute", data: Cezacik.filter(C => C.Tip == "Voice Mute").length },
        { name: "Uyarı", data: Cezacik.filter(C => C.Tip == "Uyarı").length },
      ].filter(xd => xd.data > 0);

      const CText = [];
      for(let index = 0; index < Datas.length; index++) {
          const Data = Datas[index];
          CText.push(`**${Data.name}**: \`${Data.data}\``);
      };

      const Profil = new Discord.MessageEmbed()
        .setColor(Settings.Color)
      .setAuthor(member.displayName, member.user.avatarURL({dynamic: true})) //           \`•\` Kayıt Bilgileri: **${toplamKayit || 0}** ${defRegs == null || defRegs == "" ? `` : `(${defRegs})`}
      .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true})) //           \`•\` Kaydettiği bazı üyeler: ${registeredMems.length > 0 ? registeredMems.slice(0, 5).map(xd => message.guild.members.cache.get(xd.userID)).join(" | ") : `**Bulunamadı**`}
      .setDescription(`
❯ **Kullanıcı Bilgisi**
\`•\` Kullanıcı ID: **${member.user.id}**
\`•\` Hesap: ${member.toString()}
\`•\` Oluşturulma: **${Utils.tarih(member.user.createdTimestamp)}** (\`${moment(member.user.createdTimestamp).fromNow()}\`)
\`•\` Durum: **${status[member.presence.status]}**
        ${member.presence.status !== "offline" ? `\`•\`  Bağlandığı Cihaz: **${platforms[0] ? platforms[0] : "Bilinmiyor"}**` : ``}
        ${Utils.YetkiliMi(member) || member.permissions.has(8) ? `
❯ **Yetkili Bilgisi**
\`•\` Tag Bilgileri: **${Tags || 0}**
\`•\` Ceza Bilgileri: ${CText.length > 0 ? CText.join(" | ") : `**Alınamadı**`}

❯ **Görev Bilgisi**
\`•\` Aktif Görevi: **${Task.filter(gorev => gorev.durum).length}**
\`•\` Tamamlanan Görev: **${Task.filter(gorev => gorev.tamamlandi).length}**
\`•\` Tamamlanmayan Görev: **${Task.filter(gorev => !gorev.tamamlandi).length}**
\`•\` Görev Tamamlama Oranı: **%${Math.round((Task.filter(gorev => gorev.tamamlandi).length || 0 / Task.length || 0) * 100)}**
` : ``}
❯ **Üyelik Bilgisi**
\`•\` Takma isim: **${member.nickname ? member.nickname : 'Yok'}**
\`•\` Sunucuya katılım: **${Utils.tarih(member.joinedTimestamp)}** (\`${moment(member.joinedTimestamp).fromNow()}\`)
\`•\` Bazı rolleri: ${member.roles.cache.filter(xd => xd.id !== message.guild.id).size > 0 ? member.roles.cache.filter(xd => xd.id !== message.guild.id).map(xd => xd).slice(0, 5).map(rol => rol.toString()).join(" | ") : '**Kullanıcı üzerinde rol bulunmuyor.**'}
`)

      message.react(global.emojis.tick);
      return message.inlineReply({ embed: Profil }).catch(err => {});
    }
};
