const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;
const JoinedAt = require('../../Schemas/JoinedAt');
const voiceParent = require('../../Schemas/voiceParent');

module.exports = async (oldState, newState) => {
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  if (!oldState.channelID && newState.channelID) await JoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { data: Date.now() } }, { upsert: true });
  let JoinedAtData = await JoinedAt.findOne({ userID: oldState.id });
  if (!JoinedAtData) await JoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  JoinedAtData = await JoinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - JoinedAtData.data;

  if (oldState.channelID && !newState.channelID) {
    await saveStats(oldState, oldState.channel, data);
    await saveCoin(oldState, oldState.channel, data);
    await JoinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelID && newState.channelID) {
    await saveStats(oldState, oldState.channel, data);
    await saveCoin(oldState, oldState.channel, data);
    await JoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { data: Date.now() } }, { upsert: true });
  };
};

async function saveStats (user, channel, data) {
  if (Settings.Systems.Yetki == true && user.member && Settings.staffRoles.some(perm => user.member.roles.cache.has(perm)) && !Settings.Rooms.Gecersiz.some((kanal) => channel.id == kanal)) {
    if (channel.parentID !== null) await voiceParent.findOneAndUpdate({ userID: user.id, parentID: channel.parentID }, { parentID: channel.parentID, $inc: { parentData: +data } }, { upsert: true })
    if (Settings.Rooms.Public.includes(channel.parentID)) {
      if (data >= (1000 * 60) * 1) {
        if (Settings.Systems.Yetki == true) await user.member.puanEkle(Math.floor(parseInt(data/1000/60) / 1) * 0.4)
      };
    } else if (data >= (1000 * 60) * 2) {
      if (Settings.Systems.Yetki == true) await user.member.puanEkle(Math.floor(parseInt(data/1000/60) / 2) * 0.4)
    };
  };

  if (Utils.YetkiliMi(user.member)) await user.member.gorevGuncelle('ses', data);
};

async function saveCoin (user, channel, data) {
  if (Settings.Systems.Market == true && user.member && !Settings.Rooms.Gecersiz.some((kanal) => channel.id == kanal)) {
    if (data >= (1000 * 60) * 1) {
      if (Settings.Rooms.Public.includes(channel.parentID)) await user.member.coinEkle(Math.floor(parseInt(data/1000/60) / 1) * 2);
      else if (Settings.Systems.Market == true) await user.member.coinEkle(Math.floor(parseInt(data/1000/60) / 1) * 1);
    };
  };
};

module.exports.config = {
    Event: "voiceStateUpdate"
}
