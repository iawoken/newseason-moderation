const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "ban",
    aliases: ['yasakla'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.banHammer.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        if (args[args.length -1] == '--list' || args[args.length -1] == '--liste') {
            const bans = await message.guild.fetchBans();
            if (bans.size == 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu sunucuda herhangi bir yasaklı kullanıcı bulunamadı!`).then(x => x.delete({timeout: 6000})).catch(err => {});

            const tableConfig = {
                border: {
                  topBody: ``,
                  topJoin: ``,
                  topLeft: ``,
                  topRight: ``,

                  bottomBody: ``,
                  bottomJoin: ``,
                  bottomLeft: ``,
                  bottomRight: ``,

                  bodyLeft: `│`,
                  bodyRight: `│`,
                  bodyJoin: `│`,

                  joinBody: ``,
                  joinLeft: ``,
                  joinRight: ``,
                  joinJoin: ``
                },
                drawHorizontalLine: function (index, size) {
                  return index === 0 || index === 1 || index === size;
                }
              };
              let indexNum = 1;

              const Data = [['ID', 'Kullanıcı Adı', 'Sebep']]
              bans.slice(0, 10).map((data) => {
                Data.push([indexNum, `${data.user.tag}`, data.reason ? data.reason.includes('| Sebep:') ? data.reason.split('| Sebep: ').slice(1).join(' ') : data.reason : "Sebep Belirtilmedi."]);
                indexNum++;
              });

            message.react(global.emojis.tick);
            return message.inlineReply("```\n"+table.table(Data, tableConfig)+"\n```").then(x => x.delete({timeout: 6000})).catch(err => {});
        };

        if (args[0] == "bilgi" || args[0] == "info") {
          const ID = args[1];
          if (!ID) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir kullanıcı ID'si belirtin.`).then(x => x.delete({timeout: 6000}));

          const Embed = new Discord.MessageEmbed()
          .setColor(Settings.Color)
          .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))

          await message.guild.fetchBans().then(async (xd) => {
            const aranan = xd.find(usr => usr.user.id == ID);
            if (!aranan) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcı sunucudan yasaklanmamış.`).then(x => x.delete({timeout: 6000}));

            let text = `${global.emojis.cross} ${aranan.user.tag} (\`${aranan.user.id}\`) kişisi sunucumuzdan aşağıdaki sebepten ötürü yasaklanmış.\n\n\`•\` Sebep: "${aranan.reason || "Sebep Belirtilmemiş."}"`;

            await message.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD', limit: 100 }).then(denetim => {
              const user = denetim.entries.find(xd => xd.target.id == aranan.user.id);

              if (user) {
                text += `\n─────────────────────────────\nKullanıcı, ${user.executor.tag} (\`${user.executor.id}\`) tarafından \`${Utils.tarih(user.createdAt)}\` tarihinde yasaklanmış.`;
                return message.inlineReply({ embed: Embed.setDescription(text) });
              } else {
                text += `\n\nBu yasaklama, son 100 yasaklama içinde olmadığından dolayı ban bilgisini size gösteremiyorum.`;
                return message.inlineReply({ embed: Embed.setDescription(text) });
              };
            });
          }).catch(err => {
            return message.react(global.emojis.cross) && message.inlineReply(`Hata: Kullanıcının yasak bilgilerini çekemedim.`).then(x => x.delete({timeout: 6000}))
          });
          return;
        };

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const Reason = args.slice(1).join(" ");

        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).catch(err => {}).then(x => x.delete({timeout: 6000}));
        if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).catch(err => {}).then(x => x.delete({timeout: 6000}));
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));
        if (Settings.staffRoles.some(rol => member.roles.cache.has(rol))) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiliban).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (!Reason) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir yasaklama sebebi belirtin!`).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (!member.bannable) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcıyı yasaklamak için yetkim yok.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        message.guild.members.ban(member.id, { reason: `Yetkili: ${message.author.tag} | Sebep: ${Reason}` }).catch(err => {});

        await Utils.CezaEkle(member, message.member, "Ban", Reason, {
            Tarih: Date.now(),
            Sure: null,
            Bitis: null
        });

        await message.react(`${global.emojis.tick}`);
        message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisi __${Reason}__ sebebi ile ${message.member.toString()} tarafından sunucudan yasaklandı! (Ceza Numarası: \`#${await Utils.cezaNumarasiGetir()-1}\`)`).catch(err => {});

        return message.guild.log(member, message.member, 'Ban', 'ban-log', { ID: await Utils.cezaNumarasiGetir()-1, Sebep: Reason }).catch(err => {});;
    }
};
