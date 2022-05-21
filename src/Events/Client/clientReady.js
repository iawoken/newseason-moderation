const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;
const Alarm = require('../../Schemas/Alarm');
global.davetler = new Map();

module.exports = async () => {
    client.user.setPresence({ activity: { name: global.config.Status.random() }, status: "online" });
    global.snipes = new Discord.Collection();
    global.afk = new Discord.Collection();
    const guild = client.guilds.cache.get(Settings.Sunucuid);
    if (!guild) return Utils.logger('error', 'Sunucu bulunamadığından dolayı "Ready" eventi başlatılamadı.')
    guild.fetchInvites().then(invites => global.davetler.set(guild.id, invites)).catch(err => Utils.logger('error', err));
    let botVoiceChannel = this.client.channels.cache.get("916072431289004102");
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    setInterval(() => {
      client.user.setPresence({ activity: { name: global.config.Status.random() }, status: "online" });
      checkTags();
      checkMembers();
      alarmKontrol();
    }, 10000)
};

async function checkTags () {
    let guild = client.guilds.cache.get(Settings.Sunucuid);
    if (!guild) return;
    const Family = guild.roles.cache.get(Settings.familyRol);
    if (!Family) return;

    guild.members.cache.filter(uyecik => !uyecik.user.bot && Utils.TagKontrol(uyecik.user) && !uyecik.roles.cache.has(Family.id)).map((member) => {
        member.roles.add(Family.id, "Kullanıcının Tagı Bulunuyor.")
    });

    guild.members.cache.filter(uyecik => !uyecik.user.bot && !Utils.TagKontrol(uyecik.user) && uyecik.roles.cache.has(Family.id)).map((member) => {
        member.roles.remove(Family.id, "Kullanıcının Tagı Bulunmuyor.")
    });
};

async function checkMembers () {
  let guild = client.guilds.cache.get(Settings.Sunucuid);
  if (!guild) return;

  if (Settings.Taglialim == true) {
    guild.members.cache.filter(awoken => !awoken.user.bot && Utils.KayıtKontrol(awoken) && Utils.TagKontrol(awoken.user) == false && Utils.BoostKontrol(awoken) == false && !awoken.roles.cache.has(Settings.vipRol)).map(member => {
      member.roles.set(Utils.BoostKontrol(member) ? Settings.unregisterRol.concat(Settings.boosterRol) : Settings.unregisterRol).catch(err => {});
    });

    return;
  };
};

async function alarmKontrol() {
  const sunucu = client.guilds.cache.get(Settings.Sunucuid);
  if (!sunucu) return;

  const Alarmcik = await Alarm.find({ durum: true, bitis: { $lte: Date.now() } });
  if (Alarmcik.length < 1) return

  Alarmcik.forEach(async (veri) => {
    let member = sunucu.members.cache.get(veri.userID) || await sunucu.members.cacahe.fetch(veri.userID).catch(async (err) => {
      await Alarm.deleteOne({ userID: veri.userID }).catch(err => Utils.logger('error', `(${veri.userID}) ID'sine sahip kullanıcının alarm verisi silinemedi.`));
    });

    if (!member) return;
    let kanal = sunucu.channels.cache.get(veri.kanal);
    if (!kanal) kanal = sunucu.channels.cache.get(Settings.Channels.Chat);

    if (kanal) kanal.send(`:alarm_clock: | Hey, ${member.toString()}! \`${veri.sebep}\` sebebi ile alarm kurmamı istemiştin.`);
    await member.send(`:alarm_clock: | Hey, ${member.toString()}! \`${veri.sebep}\` sebebi ile alarm kurmamı istemiştin.`).catch(err => {});

    return await Alarm.deleteOne({ userID: veri.userID }).catch(err => Utils.logger('error', `(${member.user.tag}) kişisinin alarm verisi silinemedi.`));
  });
};

module.exports.config = {
    Event: "ready"
}
