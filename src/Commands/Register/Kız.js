const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
module.exports = {
    name: "kız",
    aliases: ['k', 'woman','gaci'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!global.config.Owners.includes(message.author.id) && !message.member.roles.cache.has(Settings.BotRegister) && !message.member.permissions.has(8) && !Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !Settings.registerPerm.some(perm => message.member.roles.cache.has(perm))) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});

        let nick = args[1],
            age  = args[2];

        if(!nick || !isNaN(nick)) return message.react(global.emojis.cross) && message.inlineReply(`Geçerli bir isim belirtmelisiniz.`).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Settings.yasGerekli == true && !age) return message.react(global.emojis.cross) && message.inlineReply(`Geçerli bir yaş belirtmelisiniz.`).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Settings.yasGerekli == true && isNaN(age)) return message.react(global.emojis.cross) && message.inlineReply(`Geçerli bir yaş belirtmelisiniz.`).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Settings.yasGerekli == true && age < Settings.yaşSınır) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetersizyaş).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(nick.length > 32) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.uzunisim).then(x => x.delete({timeout: 6000})).catch(err => {});

        if(Settings.Taglialim == true && !Utils.TagKontrol(member.user) && !Utils.BoostKontrol(member) && !member.roles.cache.has(Settings.vipRol)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.tagyok).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Utils.KayıtKontrol(member)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kayıtlı).then(x => x.delete({timeout: 6000})).catch(err => {});

        const CezaPuan = await Utils.CezaPuanGetir(member) || 0;

        if (CezaPuan > 200) {
            const Cezaciklarxd = await Utils.CezalariGetir(member, {type: "category"});

            const CPuanError = new Discord.MessageEmbed()
            .setColor(Settings.Color)
            .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
            .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, format: "png" }))
            .setDescription(`Hey, bu kullanıcının toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü kayıt işlemi iptal edildi!\n\nBu kişi toplamda ${Cezaciklarxd} cezaları almış!`)

            return message.react(global.emojis.cross) && message.inlineReply({embed: CPuanError}).catch(err => {});
        };

        await member.setNickname(`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} ${Settings.yasGerekli == true ? `| ${age}` : ``}`).catch(err => {
          message.react(global.emojis.cross) && message.inlineReply(`Kullanıcı adı değiştirilirken bir hata oluştu!`).then(x => x.delete({timeout: 8000})).catch(hata => {});
        });

        await member.roles.add(Settings.kizRol).catch(err => {})
        await member.roles.remove(Settings.unregisterRol).catch(err => {})
        if (Utils.TagKontrol(member.user) && message.guild.roles.cache.has(Settings.familyRol)) await member.roles.add(Settings.familyRol).catch(err => {});

        await Utils.KayitEt(member, message.member, {
            cinsiyet: "Kız",
            name: nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase(),
            age: Settings.yasGerekli == true ? age : "Yok"
        });

        const xdxd = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL({ dynamic: true }))
        .setFooter(`Üyenin ceza puanı: ${CezaPuan}`)// client.user.avatarURL({ dynamic: true, format: "png" })
        .setDescription(`${member.user} üyesine <@&916072301374631937> rolü verildi.`)
        return message.react(global.emojis.tick) && message.inlineReply({embed: xdxd}).catch(err => {});
        let Chat = message.guild.channels.cache.get(Settings.Channels.Chat)
        if (!Chat) return console.log('Chat Kanalı YOK!');
        Chat.send(`${member} Sunucumuza katıldı hoş geldin dostum.`).then(x => x.delete({timeout: 15000})).catch(e => {}) 
        return;
      }
};
