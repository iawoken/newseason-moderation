const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')
const Ban = require('../../Schemas/Ban');

module.exports = {
    name: "açılmazban",
    aliases: ['açılmaz-ban', 'acilmazban', 'acilmaz-ban'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !global.config.Owners.includes(message.author.id)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        if (args[0] && args[0] == "ekle") {
          await client.users.fetch(args[1]).then(resp => {
            if (!resp) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.bulunamadi).then(x => x.delete({timeout: 6000}));

            message.guild.fetchBans().then(async (bans) => {
              let ban = bans.find(xd => xd.user.id == resp.id);
              if (!ban) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcı sunucuda yasaklı değil!`).then(x => x.delete({timeout: 6000}));

              await Ban.findOne({ userID: resp.id }, (err, data) => {
                if (data) {
                  return message.react(global.emojis.cross) && message.inlineReply(`Hata: **${resp.tag}** kişisi zaten <@${data.Yetkili}> tarafından "Açılmaz Ban" olarak işaretlenmiş!`).then(x => x.delete({timeout: 6000}));
                } else {
                  message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                    let user = audit.entries.find(a => a.target.id === resp.id)
                    if (!user) return message.react(global.emojis.cross) && message.inlineReply(`Hata: "Açılmaz Ban" olarak işaretlemeye çalıştığınız kullanıcı son 100 yasaklama içerisinde bulunamadı.`).then(x => x.delete({timeout: 6000}));
                    if(user && !user.executor.bot && user.executor.id !== message.author.id) {
                      message.react(global.emojis.cross);
                      message.inlineReply(`Hata: Bu kullanıcıyı sadece sunucudan yasaklayan kişi "Açılmaz Ban" olarak işaretleyebilir.`).then(x => x.delete({timeout: 6000}));
                      return;
                    };
                  });

                  const BanData = new Ban({
                      userID: resp.id,
                      Yetkili: message.author.id,
                      Sebep: ban.reason || "Sebep Belirtilmemiş"
                  })

                  BanData.save().catch(e => Utils.logger('error', `(${resp.tag}) kullanıcısı "Açılmaz Ban" olarak veri tabanına kayıt edilemedi.`))
                };

                message.react(`${global.emojis.tick}`)
                return message.inlineReply(`${global.emojis.tick} **${resp.tag}** kişisi başarıyla "Açılmaz Ban" olarak eklendi!`);
              });
            })
          }).catch(err => {
            message.react(`${global.emojis.cross}`)
            return message.inlineReply(global.cevaplar.bulunamadi);
          });
        } else if (args[0] && args[0] == "kaldır" || args[0] == "kaldir") {

          await client.users.fetch(args[1]).then(resp => {
            if (!resp) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.bulunamadi);
              message.guild.fetchBans().then(async (bans) => {
                let ban = await bans.find(a => a.user.id === resp.id);
                if (!ban) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcı sunucuda yasaklı değil!`).then(x => x.delete({timeout: 6000}));

                await Ban.findOne({ userID: resp.id }, (err, data) => {
                  if (!data) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcı zaten "Açılmaz Ban" olarak işaretlenmemiş.`).then(x => x.delete({timeout: 6000}))
                  if(!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !global.config.Owners.includes(message.author.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kişinin "Açılmaz Ban" etiketini kaldırmak için yeterli yetkiye sahip değilsiniz.`).then(x => x.delete({timeout: 6000}));

                  data.delete().catch(e => Utils.logger('error', `(${resp.tag}) kullanıcısının "Açılmaz Ban" etiketi veri tabanından silinemedi.`)).then(x => x.delete({timeout: 6000}));
                  message.react(global.emojis.cross);
                  message.inlineReply(`${global.emojis.tick} **${resp.tag}** kişisinin "Açılmaz Ban" etiketi başarıyla kaldırıldı!`);
                });
              });
          }).catch(err => {
            message.react(`${global.emojis.cross}`)
            return message.inlineReply(global.cevaplar.bulunamadi).then(x => x.delete({timeout: 6000}));
          });
        } else {
          return message.react(`${global.emojis.cross}`);
        };
      }
};
