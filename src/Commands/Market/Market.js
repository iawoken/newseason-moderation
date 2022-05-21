const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Urunler = require('../../Configs/Shop.js');
const table = require('table');

module.exports = {
    name: "market",
    aliases: ['coinmarket', 'coin-market'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (Settings.Systems.Market !== true) return;
      const Coin = await message.member.coinGetir() || 0;
      var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
      let Dukkanamk = [["ID", "İsim", "Detay" ,"Fiyat"]];
      Dukkanamk = Dukkanamk.concat(Urunler.sort((a, b) => b.id - a.id).map((item, index) => {
        let fiyatcik = `${Number(item.coin).toLocaleString()} 💵`;
        return [
          `#${item.ID}`,
          `${item.name}`,
          `${item.detay}`,
          `${fiyatcik}`
        ]
      }));

      const tableConfig = {
        border: table.getBorderCharacters(`void`),
        columnDefault: {
          paddingLeft: 0,
          paddingRight: 1,
        },
        columns: {
          0: {
            paddingLeft: 1
          },
          1: {
            paddingLeft: 1
          },
          2: {
            paddingLeft: 1,
            alignment: "center"
          },
          3: {
            paddingLeft: 1,
            paddingRight: 1,
          },
        },
        drawHorizontalLine: (index, size) => {
          return index === 0 || index === 1 || index === size;
        }
      };

      const Embed = new Discord.MessageEmbed()
      .setColor(Settings.Color)
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
      .setDescription(`Selam ${message.member.toString()}! Mağazaya hoş geldin.\nBir takım görevleri tamamlayarak coin kazanabilirsin ve bu coinleri burada harcayabilirsin.`)
      .addField(`Mağaza (\`${Coin} 💵\`)`, `\`\`\`css\n${table.table(Dukkanamk, tableConfig)}\n\`\`\``)
      .addField(`${global.emojis.star} Satın alma işlemi nasıl yapılır?`, `Aşağıdaki emojiye tıklayıp, satın almak istediğiniz ürünün **ID numarasını** girmelisiniz. Eğer gereken coini karşılıyorsanız size özel bir kanal açılır ve ürün teslim edilir.`)

      message.inlineReply({ embed: Embed }).then(async (msg) => {
        await msg.react(global.emojis.star);
        let react = await msg.awaitReactions((reaction, user) => user.id == message.author.id, { errors: ["time"], max: 1, time: 30000 }).then(coll => coll.first()).catch(err => {  msg.reactions.removeAll(); return; });
        if (!react) return;

        if (react.emoji.toString() == global.emojis.star) {
          const satinalamkcocu = await message.inlineReply(`${global.emojis.star2} Selam, satın almak istediğin ürünün **ID** numarasını kanala yazar mısın?`);
          message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(async (awoken) => {
            let id = awoken.first().content;
            let alinicak = Urunler.find((itemcik) => itemcik.ID == id);
            if (alinicak) {
              if (satinalamkcocu) satinalamkcocu.delete();
              const onayverseneyarram = await message.inlineReply(`${global.emojis.star2} **#${alinicak.ID}** ID'li \`${alinicak.name}\` isimli ürünü \`${Number(alinicak.coin).toLocaleString()} 💵\` fiyatına satın almak istediğine emin misin? (**Evet**/**Hayır**)`);
              message.channel.awaitMessages(filter, { errors: ["time"], max: 1, time: 10000}).then(async (awosatinal) => {
                if(awosatinal.first().content.toLowerCase() === "hayır" || awosatinal.first().content.toLowerCase() === "hayir") {
                  msg.reactions.removeAll();
                  message.inlineReply(`${global.emojis.tick} **${alinicak.name}** isimli ürünü almaktan vazgeçtin.`)
                  if (onayverseneyarram) onayverseneyarram.delete();
                };

                if(awosatinal.first().content.toLowerCase() === "evet") {
                  if (Coin >= alinicak.coin) {
                    if (alinicak.tagliozel == true && !Utils.TagKontrol(message.author)) {
                      msg.reactions.removeAll();
                      message.inlineReply(`Hata: Bu ürünü satın alabilmek için tagımıza sahip olman gerekmekte!`).then(x => x.delete({timeout: 7500})).catch(err => {});
                      if (onayverseneyarram) onayverseneyarram.delete();
                      return;
                    };

                    let cat = message.guild.channels.cache.find(x => x.name == 'Market' && x.type == 'category');
                    if (!cat) {
                      message.guild.channels.create('Market', {
                        type: 'category',
                        permissionOverwrites: [
                           {
                             id: message.guild.roles.cache.find(xd => xd.id == message.guild.id).id,
                             deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                          },
                        ],
                      }).then(kategori => {
                        cat = kategori;
                      });
                    };

                    message.guild.channels.create(`market-${message.author.id}`, {
                      type: 'text',
                      permissionOverwrites: [
                        {
                          id: message.guild.roles.cache.find(xd => xd.id == message.guild.id).id,
                          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                       },
                       {
                         id: message.author.id,
                         allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                       },
                      ],
                    }).then(async (kanal) => {
                      await message.member.coinEkle(-alinicak.coin);
                      await kanal.setParent(cat.id);
                      const Embedcik = new Discord.MessageEmbed()
                      .setColor(Settings.Color)
                      .setAuthor(`Selam, ${message.author.username}!`, message.author.avatarURL({ dynamic: true }))
                      .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
                      .setDescription(`**${alinicak.name}** isimli ürünü satın aldığın için teşekkürler.\nYönetim ekibimiz hediyeni sana teslim edecektir, iyi eğlenceler!`)
                      .addField(`❯ Kullanıcı Bilgisi`, `\`•\` Kullanıcı ID: **${message.author.id}**\n\`•\` Kullanıcı Tag: **${message.author.tag}**\n\`•\` Oluşturulma: **${Utils.tarih(message.author.createdAt)}**`)
                      .addField(`❯ Satın Alım Bilgisi`, `\`•\` Satın Alınan: **#${alinicak.ID}** -> **${alinicak.name}**\n\`•\` Fiyat: **${Number(alinicak.coin).toLocaleString().replace('.', ',')}**\n \`•\` İşlem Sonu Bakiye: **${Number(await message.member.coinGetir() || 0).toLocaleString().replace('.', ',')}** ${global.emojis.reward}`)
                      message.inlineReply(`${global.emojis.tick} **${alinicak.name}** isimli ürünü satın alma talebin başarıyla oluşturuldu.`).then(x => x.delete({timeout: 12000})).catch(err => {});
                      await kanal.send(`@everyone`, { embed: Embedcik });
                    });
                  } else {
                    msg.reactions.removeAll();
                    message.inlineReply(`Hata: **${alinicak.name}** isimli ürünü satın alabilmek için \`${Number((alinicak.coin - Coin) < 0 ? 0 : alinicak.coin - Coin).toLocaleString()} 💵\` coine daha ihtiyacın var.`);
                    if (onayverseneyarram) onayverseneyarram.delete();
                  };
                };
              });
            };
          });
        };
      });
    }
};
