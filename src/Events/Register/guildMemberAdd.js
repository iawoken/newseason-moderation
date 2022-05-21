const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;
const moment = require('moment')
moment.locale('tr');

const Registerxd = require('../../Schemas/Register');

module.exports = async (member) => {
    if(member.user.bot) return;
    const Register = await Registerxd.findOne({ userID: member.user.id });
    let Jails = await Utils.CezalariGetir(member);
    Jails = Jails.filter(Cezacik => Cezacik.Aktif == true && Cezacik.Tip == "Jail").sort((a, b) => Number(b.Other.Tarih) - Number(a.Other.Tarih));

    if (Jails.length > 0) {
        await member.roles.set(member.roles.cache.has(Settings.boosterRol) ? [Settings.JailRol, Settings.boosterRol] : [Settings.JailRol]);
        await member.setNickname(`${Settings.TagsizSembol} Cezalı`)
        if (member.guild.channels.cache.has(Settings.Channels.Welcome)) {
            await member.guild.channels.cache.get(Settings.Channels.Welcome).send(`${global.emojis.cross} ${member.toString()} \`-\` **${member.user.tag.replace('*', '')}** sunucuya katıldı fakat kişinin devam eden bir cezası bulunuyor. Bu nedenle **Cezalı** olarak işaretlendi!`)
        };
        await member.send(`${global.emojis.cross} Selam, sunucumuzda \`${Utils.tarih(Number(Jails[0].Other.Tarih))}\` tarihinde **${Jails[0].Sebep}** sebebi ile cezalı olarak işaretlenmişsiniz!`).catch(err => Utils.logger('warn', `${member.user.tag} kişisine özel mesaj gönderilirken bir hata oluştu!`))
        return;
    };

    let Nicknames = [];
    if (Register) {
        Nicknames = Register.Nicknames.filter(xd => xd.islem == "Kayıt").sort((a, b) => Number(b.tarih) - Number(a.tarih));
    };

    let supheliMi = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

    const defWelcomeMessage = `**${Settings.Sunucuadi}** sunucusuna hoş geldin ${member.toString()} :tada:\n\nHesabın **${Utils.tarih(member.user.createdTimestamp)}** tarihinde \`(${moment(member.user.createdTimestamp).fromNow()})\` oluşturulmuş.\n\nSunucu kurallarımız ${member.guild.channels.cache.get(Settings.Channels.Rules).toString()} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber **${member.guild.memberCount}** kişi olduk!`;

    if (supheliMi) {
        await member.roles.set(member.roles.cache.has(Settings.boosterRol) ? [Settings.SupheliRol, Settings.boosterRol] : [Settings.SupheliRol]);
        await member.setNickname(`${Settings.TagsizSembol} Şüpheli`);

        if (member.guild.channels.cache.has(Settings.Channels.Welcome)) {
            await member.guild.channels.cache.get(Settings.Channels.Welcome).send(`${global.emojis.cross} ${member.toString()} \`-\` **${member.user.tag.replace('*', '')}** kişisinin hesabı yeni açıldığı için **Şüpheli** olarak işaretlendi!`).catch(err => {});
        };
        return;
    } else {
        await member.setNickname(`${Settings.TagsizSembol} İsim | Yaş`);
        await member.roles.add(Utils.BoostKontrol(member) ? Settings.unregisterRol.concat(Settings.boosterRol) : Settings.unregisterRol).catch(err => Utils.logger('warn', `${member.user.tag} - Kullanıcıya Oto-Rol verilirken bir hata oluştu.`));
    };

    if(Nicknames.length == 0) {
        if (member.guild.channels.cache.has(Settings.Channels.Welcome)) {
            await member.guild.channels.cache.get(Settings.Channels.Welcome).send(defWelcomeMessage);
        };
    } else {
        await member.setNickname(`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${Nicknames[0].isim}${Settings.yasGerekli == true ? ` | ${Nicknames[0].yas}` : ``}`)
        if (Nicknames[0].cinsiyet == "Erkek") await member.roles.set(member.roles.cache.has(Settings.boosterRol) ? Settings.erkekRol.concat(Settings.boosterRol) : Settings.erkekRol);
        else if (Nicknames[0].cinsiyet == "Kız") await member.roles.set(member.roles.cache.has(Settings.boosterRol) ? Settings.kizRol.concat(Settings.boosterRol) : Settings.kizRol);

        if (member.guild.channels.cache.has(Settings.Channels.Welcome)) {
            await member.guild.channels.cache.get(Settings.Channels.Welcome).send(`${global.emojis.tick} ${member.toString()} \`-\` **${member.user.tag.replace('*', '')}** kişisi sunucumuza **${Utils.tarih(Nicknames[0].tarih)}** tarihinde **${Nicknames[0].isim}** ismiyle, **${Nicknames[0].cinsiyet}** olarak kayıt edilmiş. Bu nedenle üye sunucuya direkt olarak kayıt edildi!`);
        };
    };
};

module.exports.config = {
    Event: "guildMemberAdd"
};
