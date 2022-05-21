const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Puancik = require('../../Schemas/Puan');
const Tagged = require('../../Schemas/Taggeds')
const ms = require('ms');

module.exports = {
    name: "tagaldır",
    aliases: ['tagaldir', 'tag-aldir', 'tag-aldır', 'taglı', 'tagli'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        
        
      if (Settings.Systems.Yetki == false) return;
      if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross);

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Taglı olarak belirlemek istediğiniz kullanıcıyı etiketleyin.`).then(x => x.delete({timeout: 6000}));
      if (Utils.TagKontrol(member.user) == false) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcının isminde sunucu tagı bulunmuyor.`).then(x => x.delete({timeout: 6000}));
      if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});

      const Tagdata = await Tagged.findOne({ userID: message.author.id });
      const Usertag = await Tagged.findOne({ userID: member.id, yetkili: message.author.id });
      let Taglilar = [];
      if (Tagdata) Taglilar = Tagdata.members;

      if (Taglilar.find(obj => obj.id == member.user.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcıyı zaten taglı olarak belirlemişsin?`).then(x => x.delete({timeout: 6000}));
      if (Tagdata) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcı başkası tarafından taglı olarak belirtilmiş.`).then(x => x.delete({timeout: 6000}));

      return message.channel.send(`${message.member.toString()} üyesi sana tag aldırmak istiyor. Kabul ediyor musun? ${member.toString()}`).then(async (msg) => {
        await msg.react(`${global.emojis.tick}`);
        await msg.react(`${global.emojis.cross}`);

        msg.awaitReactions((reaction, user) => [`${global.emojis.tick}`, `${global.emojis.cross}`].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 30000, errors: ["time"] }).then(async collected => {
          const reaction = collected.first();
          if (reaction.emoji.toString() == `${global.emojis.tick}`) {
            await message.member.puanEkle(30);
            await message.member.gorevGuncelle('taglı', 1);
            msg.delete({ timeout: 1000 });
            msg.channel.send(`${global.emojis.tick} ${message.member.toString()}, ${member.toString()} üyesini taglı olarak belirlediniz!`);
            await Tagged.findOneAndUpdate({ userID: message.author.id }, { $push: { members: {id: member.user.id, tarih: Date.now()} } }, { upsert: true });
            if (message.guild.kanalBul('taglı-log')) message.guild.kanalBul('taglı-log').send(`${global.emojis.tick} ${member.toString()} üyesi, ${message.member.toString()} tarafından taglı olarak belirlendi!`);
          } else {
            msg.channel.send(`${global.emojis.cross} ${message.member.toString()}, ${member.toString()} üyesi tag aldırma teklifini reddetdi!`);
          }
        });
      });
    }
};
