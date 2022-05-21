const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "cezalar",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});

        const Cezalar = await Utils.CezalariGetir(member);
        if (!Cezalar || Cezalar.length <= 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Belirtilen üyenin ceza bilgisi bulunamadı!`).then(x => x.delete({timeout: 6000})).catch(err => {});

        let Data = [["ID", "Durum", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]];

        Data = Data.concat(Cezalar.map((value) => {
          return [
            `#${value.ID}`,
            `${value.Aktif == true ? "✅" : "❌"}`,
            `${Utils.tarih(Number(value.Other.Tarih))}`,
            `${value.Tip}`,
            `${value.Sebep}`
          ]
        }));

        let veriler = table.table(Data, {
            columns: {
                0: {
                    paddingLeft: 1
                },
                1: {
                    paddingLeft: 1
                },
                2: {
                    paddingLeft: 1,
                },
                3: {
                    paddingLeft: 1,
                    paddingRight: 1
                },
            },
            border : table.getBorderCharacters(`void`),
            drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
            }
        });

        message.react(`${global.emojis.tick}`);
        message.channel.wsend(`:no_entry_sign: <@${member.id}> (\`${member.user.tag.replace('`', '')}\` **-** \`${member.user.id}\`) kişisinin ceza kayıtları aşağıda belirtilmiştir. Tekli bir cezaya bakmak için \`${global.config.Prefix[0]}ceza ID\` komutunu uygulayınız.\n\`\`\`${veriler}\`\`\``).catch(awoken => {
          let dosya;
          dosya = new MessageAttachment(Buffer.from(veriler), `${uye.id}-cezalar.txt`);
          message.channel.wsend(`:no_entry_sign: <@${member.id}> (\`${member.user.tag.replace('`', '')}\` **-** \`${member.user.id}\`) kişisinin ceza kayıtları **Discord API** sınırını geçtiği için metin belgesi hazırlayıp gönderdim, oradan cezaları kontrol edebilirsin. Tekli bir cezaya bakmak için \`${global.config.Prefix[0]}ceza ID\` komutunu uygulayınız.`, dosya);
        });
      }
};
