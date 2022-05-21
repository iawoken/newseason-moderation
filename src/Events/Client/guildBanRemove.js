const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;
const Ban = require('../../Schemas/Ban');

module.exports = async (guild, user) => {
  await Ban.findOne({ userID: user.id }, async (err, veri) => {
    if (!veri) return;
    await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then(async (audit) => {
      let entries = audit.entries.first();
      let executor = entries.executor;

      if (executor.id == veri.Yetkili) {
        veri.delete().catch(err => Utils.logger('error', `(${veri.userID}) kişisinin "Açılmaz Ban" verisi silinirken bir hata oluştu.`));
        return;
      };

      await guild.members.ban(user.id, { reason: veri.Sebep }).catch(err => {});
    });
  });
};

module.exports.config = {
    Event: "guildBanRemove"
}
