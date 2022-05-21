const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "isim",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.registerPerm.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});

        let nick = args[1],
            age  = args[2];

        if(!nick || !isNaN(nick)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir isim belirtmelisiniz.`).catch(err => {});
        if(nick.length > 32)  return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.uzunisim).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Settings.yasGerekli == true && !age || isNaN(age)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir yaş belirtmelisiniz.`).then(x => x.delete({timeout: 6000})).catch(err => {});
        if(Settings.yasGerekli == true && age < Settings.yaşSınır) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetersizyaş).then(x => x.delete({timeout: 6000})).catch(err => {});

        const CezaPuan = await Utils.CezaPuanGetir(member) || 0;

        if (CezaPuan > 150) {
            const Cezaciklarxd = await Utils.CezalariGetir(member, {type: "category"});

            const CPuanError = new Discord.MessageEmbed()
            .setColor(Settings.Color)
            .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
            .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, format: "png" }))
            //.setDescription(`Hey, bu kullanıcının toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü işlem iptal edildi!\n\nBu kişi toplamda ${Cezaciklarxd} cezaları almış!`)
            .setDescription(`${global.emojis.cross} ${member.toString()} kişisinin toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü işlem iptal edildi! Sunucumuzda tüm işlemlerin kayıt altına alındığını unutmayın. Sorun teşkil eden, sunucu düzenini bozan ve kurallara uymayan kişiler sunucumuza kayıt olamaz, sistemlerimizden faydanalanamazlar!\n\nBelirtilen üye toplamda ${Cezaciklarxd} cezaları almış!`)
            
            return message.react(global.emojis.cross) && message.inlineReply({embed: CPuanError}).catch(err => {});
        };

        const Registerfln = require('../../Schemas/Register.js');
        let Usernames = await Registerfln.findOne({ userID: member.user.id });
        if (Usernames) {
            Usernames = Usernames.Nicknames;
            Usernames = Usernames.sort((a, b) => Number(b.tarih) - Number(a.tarih))
        }
        else Usernames = [];

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setFooter(Settings.EmbedFooter, message.author.avatarURL({ dynamic: true }))
        .setDescription(`${member.toString()} kişisinin ismi başarılı bir şekilde "${nick}${Settings.yasGerekli == true ? ` | ${age}` : ``}" olarak değiştirildi${Usernames.length > 0 ? ", bu üye daha önce bu isimlerle kayıt olmuş." : "."}`)

        if (Usernames.length > 0) {
            Embed.description += `\n\n\u200b \u200b \u200b \u200b ${global.emojis.cross} Bu kullanıcının **${Usernames.length}** adet isim kayıtı bulundu.\n`

            for (nicks of Usernames) {
                Embed.description += `\`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${nicks.fullname}\` (${nicks.cinsiyet.replace(/erkek/i, Settings.erkekRol.filter(xd => message.guild.roles.cache.has(xd)).map(rol => message.guild.roles.cache.get(rol).toString()).join(", ")).replace(/kız/i, Settings.kizRol.filter(xd => message.guild.roles.cache.has(xd)).map(rol => message.guild.roles.cache.get(rol).toString()).join(", ")).replace(/yok/i, nicks.islem)})\n`;
            };
        };

        Embed.description += `\n\n:white_small_square: Kullanıcının isim geçmişine bakmak isterseniz: \`${global.config.Prefix[0]}isimler @awoken/ID\` komutunu kullanabilirsiniz.`;

        await member.setNickname(`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} | ${age}`).catch(err => {
          message.react(global.emojis.cross);
          message.inlineReply(`Hata: Kullanıcı adı değiştirilirken bir hata oluştu!`).then(x => x.delete({timeout: 8000})).catch(hata => {});
        });

        await Utils.isimDegistir(member, {
            name: nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase(),
            age: Settings.yasGerekli == true ? age : "Yok"
        });

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({embed: Embed}).catch(err => {});
    }
};
