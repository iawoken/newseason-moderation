const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;
const Davetxd = require('../../Schemas/Invite.js');

module.exports = async (member) => {
    if (member.user.bot) return;
    let cachedInvites = global.davetler.get(member.guild.id);
    let newInvites = await member.guild.fetchInvites();
    let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
    let inviter = member.guild.members.cache.get(usedInvite.inviter.id);
    let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;

    if (Utils.YetkiliMi(inviter) && !isMemberFake) {
      const Davetdata = await Davetxd.findOne({ userID: inviter.id });
      let members;
      if (Davetdata) members = Davetdata.members;
      else members = [];

      if (!members.find(obj => obj.id == member.id)) {
        await inviter.puanEkle(3);
        await inviter.coinEkle(5);
        await inviter.gorevGuncelle('invite', 1);
        await Davetxd.findOneAndUpdate({ userID: inviter.id }, { $inc: { toplam: 1 }, $push: { members: { id: member.id, tarih: Date.now() } } }, { upsert: true });
      };
    };
};

module.exports.config = {
    Event: "guildMemberAdd"
}
