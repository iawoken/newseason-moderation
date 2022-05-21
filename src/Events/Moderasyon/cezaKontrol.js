const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async () => {
    setInterval(() => {
        checkMutes();
        checkJails();
        checkReklam();
    }, 10000)
};

async function checkMutes () {
    const Cezalarfln = require('../../Schemas/Ceza');
    let Cezaxd = await Cezalarfln.find({ Aktif: true, "Other.Bitis": { $lte: Date.now() } });
    Cezaxd = Cezaxd.filter(xd => xd.Tip == "Chat Mute" || xd.Tip == "Voice Mute");
    if (!Cezaxd || Cezaxd.length <= 0) return;

    let finishedMutes = Cezaxd.filter(awoken => Date.now() > Number(awoken.Other.Bitis));
    let guild = client.guilds.cache.get(Settings.Sunucuid);
    if (!guild) return;
    let clientUser = guild.members.cache.get(client.user.id);

    finishedMutes.forEach(async (Cezacik) => {
      Cezacik.Aktif = false;
      const member = guild.members.cache.get(Cezacik.userID);

      if(member) {
        if(member.roles.cache.has(Settings.chatMuteRol)) member.roles.remove(Settings.chatMuteRol)
        if(Cezacik.Tip == "Voice Mute" && (member.voice.channelID !== null && member.voice.serverMute !== false)) member.voice.setMute(false)
        Cezacik.save().then(() => {
            if (Cezacik.Tip == "Voice Mute") guild.unlog(member, clientUser, "unvmute", "mute-log", {ID: Cezacik.ID});
            else if (Cezacik.Tip == "Chat Mute") guild.unlog(member, clientUser, "unmute", "mute-log", {ID: Cezacik.ID});
        });
      };
    });

    await Cezalarfln.updateMany({Activity: true, "Other.Bitis": {$exists: true, $lte: Date.now()}}, {$set: {Activity: false}}, {multi: true}).exec();
};

async function checkJails () {
    const Cezalarfln = require('../../Schemas/Ceza');
    let Cezaxd = await Cezalarfln.find({ Aktif: true, "Other.Bitis": { $lte: Date.now() } });
    Cezaxd = Cezaxd.filter(xd => xd.Tip == "Jail");
    if (!Cezaxd || Cezaxd.length <= 0) return;

    let finishedJails = Cezaxd.filter(awoken => Date.now() > Number(awoken.Other.Bitis));
    let guild = client.guilds.cache.get(Settings.Sunucuid);
    if (!guild) return;
    let clientUser = guild.members.cache.get(client.user.id);

    finishedJails.forEach(async (Cezacik) => {
      Cezacik.Aktif = false;
      const member = guild.members.cache.get(Cezacik.userID);

      if(member) {
        await member.setNickname(`• İsim | Yaş`)
        await member.roles.set(Settings.unregisterRol)

        Cezacik.save().then(async () => {
            guild.unlog(member, clientUser, "unjail", "jail-log", {ID: Cezacik.ID});
        });
      };
    });

    await Cezalarfln.updateMany({Activity: true, "Other.Bitis": {$exists: true, $lte: Date.now()}}, {$set: {Activity: false}}, {multi: true}).exec();
};



async function checkReklam () {
    const Cezalarfln = require('../../Schemas/Ceza');
    let Cezaxd = await Cezalarfln.find({ Aktif: true });
    Cezaxd = Cezaxd.filter(xd => xd.Tip == "Reklam");
    if (!Cezaxd || Cezaxd.length <= 0) return;
  
    let guild = client.guilds.cache.get(Settings.Sunucuid);
    if (!guild) return;
    
    Cezaxd.map((data) => {
      const member = guild.members.cache.get(data.userID);
      if (!member) return;

      if (!member.roles.cache.has('806694583143759892')) member.roles.add('806694583143759892')
    })
 };


module.exports.config = {
    Event: "ready"
};
