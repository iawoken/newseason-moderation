const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Puancik = require('../../Schemas/Puan');
const Tagged = require('../../Schemas/Taggeds')
const ms = require('ms');

module.exports = {
    name: "yetkibaşlat",
    aliases: ['yetkibaslat', 'yetki-baslat', 'yetkiyebaslat', 'yetkiye-başlat'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        
      if (Settings.Systems.Yetki == false) return;
      if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.roles.cache.has('798667309665222670') && !message.member.permissions.has(8)) return message.react(global.emojis.cross);

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000}));
      if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000}));

      const CezaPuan = await Utils.CezaPuanGetir(member) || 0;
      if (CezaPuan > 150) {
          const Cezaciklarxd = await Utils.CezalariGetir(member, {type: "category"});

          const CPuanError = new Discord.MessageEmbed()
          .setColor(Settings.Color)
          .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, format: "png" }))
          //.setDescription(`Hey, bu kullanıcının toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü kayıt işlemi iptal edildi!\n\nBu kişi toplamda ${Cezaciklarxd} cezaları almış!`)
          .setDescription(`${global.emojis.cross} ${member.toString()} kişisinin toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü işlem iptal edildi! Sunucumuzda tüm işlemlerin kayıt altına alındığını unutmayın. Sorun teşkil eden, sunucu düzenini bozan ve kurallara uymayan kişiler sunucumuza kayıt olamaz, sistemlerimizden faydanalanamazlar!\n\nBelirtilen üye toplamda ${Cezaciklarxd} cezaları almış!`)
            
          return message.react(global.emojis.cross) && message.inlineReply({embed: CPuanError}).catch(err => {});
      };

      let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.get(global.ranks[0].id);
      if (!global.ranks.find(obj => obj.id == role.id)) role = message.guild.roles.cache.get(global.ranks[0].id);

      if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role.id);
          let hammers = global.ranks.find(obj => obj.id == role.id);
          if (hammers) {
            hammers.hammers.forEach((item) => {
              if (!message.guild.roles.cache.has(item)) return;
              if (!member.roles.cache.has(item)) member.roles.add(item);
            });
          }
      };

      let memPuan = await member.puanGetir() || 0;
      await Puancik.findOneAndUpdate({ userID: member.id }, { userID: member.id, Puan: memPuan, Yetki: role.id }, { upsert: true });
      return message.inlineReply(`${global.emojis.tick} ${member} kişisinin yetkisi \`${role.name}\` olarak başlatıldı.`);
    }
};
