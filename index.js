const Discord = require('discord.js');
const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const client = global.client = new Discord.Client({
    fetchAllMembers: true
});
const { readdirSync, readdir } = require('fs');
const Utils = global.Utils = require('./src/Utils.js')
const config = global.config = require('./src/Configs/Config.js');
const settings = global.settings = require('./src/Configs/Settings.js');

require("discord-buttons")(client);
require('discord-logs')(client);

global.cevaplar = {
    üye: `Hata: Lütfen bir kullanıcı etiketleyin veya ID'sini girin.`,
    üyeyok: `Hata: Belirtmiş olduğunuz kullanıcı sunucuda bulunamadı.`,
    bulunamadi: `Hata: Lütfen geçerli bir Kullanıcı ID'si belirtin.`,
    yetkiyok: `Hata: Bu komutu kullanabilmek için gereken yetkilere sahip değilsiniz!`,
    yetkiust: `Hata: İşlem yapmaya çalıştığın üye senle aynı yetkide veya senden üstün!`,
    yetersizyaş: `Hata: Belirtilen kullanıcının yaşı, yaş sınırının (Min. ${settings.yaşSınır}) altında olduğu için işlem yapılamadı.`,
    tagyok: `Hata: Kullanıcının üzerinde sunucu tagı (\`${settings.Tag.filter(x => x.activity == true).map(tag => `${tag.type == "discriminator" ? `#${tag.tag}` : tag.tag}`).join(" | ")}\`) bulunamadığından dolayı işleminiz iptal edildi!`,
    kayıtlı: `Hata: Bu kullanıcı sunucuda zaten kayıtlı?`,
    kayıtsız: `Hata: Bu kullanıcı zaten kayıt edilmemiş?`,
    cezali: `Hata: Bu kullanıcı \`Cezalı\` olduğu için işlem yapılamadı.`,
    yenihesap: `Hata: Bu kullanıcının hesabı daha yeni açıldığından dolayı işlem iptal edildi!`,
    dokunulmaz: `Hata: Bu işlemi gerçekleştirebilmek için botun yeterli erişim izni bulunmamaktadır!`,
    uzunisim: `Hata: Bu kullanıcının isim karakteri (Max: 32) uzun olduğu için işlem iptal edildi!`,
    yetkiliban: `Hata: Bu kullanıcı sunucuda yetkili olduğu için yasaklayamazsınız!`,
    yasakyok: `Hata: Sunucuda herhangi bir yasaklama bulunamadı!`,
    kendi: `Hata: Lütfen kendi üzerinde işlem uygulamaya çalışma, yapamazsın!`
};

global.emojis = {
    tick: "<:tick:851066377808248894>",
    cross: "<:cross:851066377993453568>",
    star: "<a:star:851066120960999434>",
    star2: "<a:star2:851066120856272926>",
    stat: "<:stat:851066724728045569>",
    vmute: "<:voicemute:851067947652481054>",

    community: "<a:awoken1:851934926374567976>",
    message: "<a:awoken2:851934926362509392>",
    reward: "<a:rewards:852187347378372638>",

    fillStart: "<a:awoken_first:851066622985895946>",
    fillEnd: "<a:awoken_last:851066622965973012>",
    emptyStart: "<:gri_first:851066622906073088>",
    emptyEnd: "<:gri_last:851066622798200863>",
    fill: "<a:awoken_fill:851066622838833193>",
    empty: "<:gri_fill:851066622738169886>"
};

function loadCommands () {
    global.commands = new Discord.Collection();
    global.aliases = new Discord.Collection();

    readdirSync('./src/Commands').forEach((dir) => {
        readdir(`./src/Commands/${dir}/`, (err, files) => {
            if(err) return Utils.logger('error', err);
            files = files.filter(dosya => dosya.endsWith('.js'));
            if(files.length == 0) return;

            Utils.logger('info', `[${dir}]: ${files.length} adet komut yüklendi!`);

            files.forEach(file => {
                const komut = require(`./src/Commands/${dir}/${file}`);
                if(komut.onLoad && typeof komut.onLoad === "function") komut.onLoad(global.client);

                global.commands.set(komut.name, komut);
                if (komut.aliases && Array.isArray(komut.aliases)) {
                    komut.aliases.forEach((alias) => global.aliases.set(alias, komut));
                };
            });
        });
    });
};

function loadEvents () {
    readdirSync('./src/Events').forEach((dir) => {
        readdir(`./src/Events/${dir}`, (err, files) => {
            if(err) return Utils.logger('error', err);
            files.filter(file => file.endsWith(".js")).forEach(file => {
                let prop = require(`./src/Events/${dir}/${file}`);
                if(!prop.config) return;
                client.on(prop.config.Event, prop);
            });
        });
    });
};

function inlineReply () {
    const { APIMessage, Structures } = require("discord.js");

    class Message extends Structures.get("Message") {
        async inlineReply(content, options) {
            const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
            delete ((options || content || {}).allowedMentions || {}).repliedUser;

            const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
            Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

            if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
                apiMessage.data.allowed_mentions = { parse: ["users", "roles"] };
            if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
                Object.assign(apiMessage.data.allowed_mentions, { });

            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map(x => {
                    x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                    return x;
                }).map(this.inlineReply.bind(this)));
            }

            const { data, files } = await apiMessage.resolveFiles();
            return this.client.api.channels[this.channel.id].messages
                .post({ data, files })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    }

    Structures.extend("Message", () => Message);
};

client.progressBar = (value, maxValue, size) => {
	const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
	const emptyProgress = size - progress > 0 ? size - progress : 0;

	const progressText = global.emojis.fill.repeat(progress);
	const emptyProgressText = global.emojis.empty.repeat(emptyProgress);

	return emptyProgress > 0
		? progress === 0
			? global.emojis.emptyStart + progressText + emptyProgressText + global.emojis.emptyEnd
			: global.emojis.fillStart + progressText + emptyProgressText + global.emojis.emptyEnd
		: global.emojis.fillStart + progressText + emptyProgressText + global.emojis.fillEnd;
};

//////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
  if (settings.Systems.Gorev !== true) return;
  const moment = require('moment');
  require('moment-duration-format');
  moment.locale('tr');

  const Task = new CronJob('00 00 00 * * *', async () => {
    const Gorevler = settings.Task.Types;
    const guild = client.guilds.cache.get(settings.Sunucuid);
    if (!guild) return;
    const staffs = guild.members.cache.filter(mem => !mem.user.bot && Utils.YetkiliMi(mem));
    const Gorevxd = require('./src/Schemas/Task');
    const Tasks = await Gorevxd.find({ durum: true })
    if (Tasks.length > 0) {
      Tasks.filter(xd => xd.durum).forEach((task) => {
        task.durum = false;
        task.save();
      });
    };

    staffs.map(async (user) => {
      let Puan = 0;
      let Hedef = 0;
      Gorevler.forEach(async (type) => {
        let taskName;
        switch (type) {
          case "invite":
            Hedef = Math.floor(Math.random() * 15 + 1)
            taskName = `Sunucumuza ${Hedef} kişi davet et!`;
            Puan = Math.floor(Math.random() * 100 + 10)
            break;
          case "ses":
            Hedef = Math.floor(Math.random() * [require('ms')('1h'), require('ms')('2h'), require('ms')('3h'), require('ms')('5h'), require('ms')('4h'), require('ms')('6h')].random() + [require('ms')("10m"), require('ms')("30m"), require('ms')("20m"), require('ms')("40m")].random())
            taskName = `Seste ${moment.duration(Hedef).format("H [saat], m [dk]")} vakit geçir!`;
            Puan = Math.floor(Math.random() * 250 + 75)
            break;
          case "taglı":
            Hedef = Math.floor(Math.random() * 10 + 1)
            taskName = `${Hedef} kişiye tag aldır!`;
            Puan = Math.floor(Math.random() * 200 + 80)
            break;
          case "mesaj":
            Hedef = Math.floor(Math.random() * 1000 + 75)
            taskName = `Metin kanallarında ${Hedef} mesaj at!`;
            Puan = Math.floor(Math.random() * 150 + 100)
            break;
          case "kayıt":
            Hedef = Math.floor(Math.random() * 20 + 1)
            taskName = `Sunucumuzda ${Hedef} kişi kayıt et!`;
            Puan = Math.floor(Math.random() * 100 + 50)
            break;
        };

        await user.gorevEkle(type, Hedef, Puan, taskName);
      });
    });

    if (guild.kanalBul('task-log')) guild.kanalBul('task-log').send(`${global.emojis.star} Başarılı bir şekilde **${guild.members.cache.filter(mem => !mem.user.bot && Utils.YetkiliMi(mem)).size}** kişiye günlük görev atandı!`);
  }, null, true, 'Europe/Istanbul');

  Task.start();
});

client.on('ready', () => {
	
	
	client.on("clickMenu", async (awoken) => {
        if(awoken.message.id == "868248192549019690") {
         let mem = client.guilds.cache.get(settings.Sunucuid).members.cache.get(awoken.clicker.user.id);
          switch (awoken.values[0]) {
            case 'alone':
              if (!mem.roles.cache.has('759150285376847872')) {
		      await mem.roles.add('759150285376847872').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('759150285376847872').name} isimli rol üzerinize verildi.`, true)
	      } else if (mem.roles.cache.has('759150285376847872')) {
		      await mem.roles.remove('759150285376847872').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('759150285376847872').name} isimli rol üzerinizden alındı.`, true)
	      };
			  
	    case 'couple':
              if (!mem.roles.cache.has('759215429653626910')) {
		      await mem.roles.add('759215429653626910').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('759215429653626910').name} isimli rol üzerinize verildi.`, true)
	      } else if (mem.roles.cache.has('759215429653626910')) {
		      await mem.roles.remove('759215429653626910').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('759215429653626910').name} isimli rol üzerinizden alındı.`, true)
	      };
			  
	    case 'sewYapmiyorum':
              if (!mem.roles.cache.has('861490840878186496')) {
		      await mem.roles.add('861490840878186496').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('861490840878186496').name} isimli rol üzerinize verildi.`, true)
	      } else if (mem.roles.cache.has('861490840878186496')) {
		      await mem.roles.remove('861490840878186496').catch(err => {})
		      await awoken.reply.send(`Başarılı bir şekilde ${mem.guild.roles.cache.get('861490840878186496').name} isimli rol üzerinizden alındı.`, true)
	      };
			  
          };
        };
      })
	
	
    client.ws.on('INTERACTION_CREATE', async interaction => {
        
        let name = interaction.data.custom_id

        let GameMap = new Map([
            ["etkinlik","872500487193260042"],
    	    ["cekilis","793163245472841729"],
    	    ["couple","759215429653626910"],
    	    ["alone","872504174313603143"],
    	    ["sevgiliy","861490840878186496"],


            ['sari', '806178493800644658'],
            ['yesil', '806178489812123698'],
            ['kirmizi', '806178482710773760'],
            ['mavi', '806178486393765929'],
            ['mor', '818554661548064799'],
            ['siyah', '826929768615510067'],
            ['beyaz', '818554665330933780'],
            ['pembe', '869147386105196574']
	])

        let member = await client.guilds.cache.get("745405716940062843").members.fetch(interaction.member.user.id)
        if(!GameMap.has(name) || !member) return;
	const guild = member.guild;
	    
        let role = GameMap.get(name)
        let returnText;
        let renkler = [
            '806178493800644658',
            '806178489812123698',
            '806178482710773760',
            '806178486393765929',
            '818554661548064799',
            '826929768615510067',
            '818554665330933780',
	    '869147386105196574'
        ];

        if(member.roles.cache.has(role)){
            if (renkler.includes(role)) {
                if (Utils.TagKontrol(member.user) || member.premiumSince !== null) {
		    await member.roles.remove(role)
		    if (member.roles.cache.has('806178493800644658')) member.roles.remove('806178493800644658').catch(e => {});
		    if (member.roles.cache.has('806178489812123698')) member.roles.remove('806178489812123698').catch(e => {});
		    if (member.roles.cache.has('806178482710773760')) member.roles.remove('806178482710773760').catch(e => {});
			if (member.roles.cache.has('806178486393765929')) member.roles.remove('806178486393765929').catch(e => {});
			if (member.roles.cache.has('818554661548064799')) member.roles.remove('818554661548064799').catch(e => {});
			if (member.roles.cache.has('826929768615510067')) member.roles.remove('826929768615510067').catch(e => {});
			if (member.roles.cache.has('818554665330933780')) member.roles.remove('818554665330933780').catch(e => {});
			if (member.roles.cache.has('869147386105196574')) member.roles.remove('869147386105196574').catch(e => {});
			
                    returnText = `Rol üzerinizden alındı, yeni renkler denemeyi unutma 😏`
		    if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.cross} ${member} - \`${member.user.tag}\` isimli kullanıcı renk menüsünden <@&${role}> rolünü geri bıraktı.`);
	 
                }else {
                    returnText = `Renk rollerini üzerinizden kaldırabilmeniz için sunucumuza boost basmış olmanız veya tagımızı isminize eklemiş olmanız gerekmektedir.`
                    if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.cross} ${member} - \`${member.user.tag}\` isimli kullanıcı renk menüsünden <@&${role}> rolünü kaldırmaya çalıştı fakat işlem bot tarafından iptal edildi. (\`Hata Kodu: Tag veya Boost yok.\`)`);
	 
		};
            } else {
                await member.roles.remove(role)
                	if (member.roles.cache.has('759215429653626910')) member.roles.remove('759215429653626910').catch(e => {});
		    if (member.roles.cache.has('759150285376847872')) member.roles.remove('759150285376847872').catch(e => {});
		    if (member.roles.cache.has('861490840878186496')) member.roles.remove('861490840878186496').catch(e => {});
		    
		    if (member.roles.cache.has('793155651353837599')) member.roles.remove('793155651353837599').catch(e => {});
		    if (member.roles.cache.has('793163245472841729')) member.roles.remove('793163245472841729').catch(e => {});
		    
		returnText = `Rol üzerinizden alındı`
		if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.tick} ${member} - \`${member.user.tag}\` isimli kullanıcı ilişki/etkinlik menüsünden <@&${role}> rolünü geri bıraktı.`);
	 
            }
        }else{
            if (renkler.includes(role)) {
                if (Utils.TagKontrol(member.user) || member.premiumSince !== null) {
		    if (member.roles.cache.has('806178493800644658')) member.roles.remove('806178493800644658').catch(e => {});
		    if (member.roles.cache.has('806178489812123698')) member.roles.remove('806178489812123698').catch(e => {});
		    if (member.roles.cache.has('806178482710773760')) member.roles.remove('806178482710773760').catch(e => {});
			if (member.roles.cache.has('806178486393765929')) member.roles.remove('806178486393765929').catch(e => {});
			if (member.roles.cache.has('818554661548064799')) member.roles.remove('818554661548064799').catch(e => {});
			if (member.roles.cache.has('826929768615510067')) member.roles.remove('826929768615510067').catch(e => {});
			if (member.roles.cache.has('818554665330933780')) member.roles.remove('818554665330933780').catch(e => {});
			if (member.roles.cache.has('869147386105196574')) member.roles.remove('869147386105196574').catch(e => {});
			
                    await member.roles.add(role)
                    returnText = `Rol üzerinize verildi, yeni renginiz çok hoş 😊`
		    if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.tick} ${member} - \`${member.user.tag}\` isimli kullanıcı renk menüsünden <@&${role}> rolünü aldı.`);
                } else {
                    returnText = `Renk rollerini alabilmeniz için sunucumuza boost basmış olmanız veya tagımızı isminize eklemiş olmanız gerekmektedir.`
		   if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.cross} ${member} - \`${member.user.tag}\` isimli kullanıcı renk menüsünden <@&${role}> rolünü almaya çalıştı fakat işlem bot tarafından iptal edildi. (\`Hata Kodu: Tag veya Boost yok.\`)`);
                };
            } else {
		 if (member.roles.cache.has('759215429653626910')) member.roles.remove('759215429653626910').catch(e => {});
		    if (member.roles.cache.has('759150285376847872')) member.roles.remove('759150285376847872').catch(e => {});
		    if (member.roles.cache.has('861490840878186496')) member.roles.remove('861490840878186496').catch(e => {});
		    
		    if (member.roles.cache.has('793155651353837599')) member.roles.remove('793155651353837599').catch(e => {});
		    if (member.roles.cache.has('793163245472841729')) member.roles.remove('793163245472841729').catch(e => {});
		    
                await member.roles.add(role)
                returnText = `Rol üzerinize verildi`
		if (guild.kanalBul('buton-log')) guild.kanalBul('buton-log').send(`${global.emojis.tick} ${member} - \`${member.user.tag}\` isimli kullanıcı ilişki/etkinlik menüsünden <@&${role}> rolünü aldı.`);
	 
            }
        }
        
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: returnText,
                    flags: "64"
                }
            }
        })
        
    });

     
	
	client.api.applications(client.user.id).guilds("745405716940062843").commands.post({
		data: {
		    name: "rastgele",
		    description: "Sunucuda kayıtsız olan rastgele 10 kişiyi atar.",
		}
    	});
	
	client.api.applications(client.user.id).guilds("745405716940062843").commands.post({
		data: {
		    name: "awoken",
		    description: "Yakışıklı bir botcu.",
		}
    	});


    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'awoken'){ 
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `${['Awoken seni çok seviyo ❤️', 'Awoken sizler için çalışıyo 🧡', `Awokenin en sevdiği kişi, **${interaction.member.user.username}** geldi!`].random()}`
                    }
                }
            })
        } else if (command === 'rastgele'){
	    const guildcik = client.guilds.cache.get("745405716940062843");
	    const uyeler = guildcik.members.cache.filter(x => !x.user.bot && settings.unregisterRol.some(y => x.roles.cache.has(y))).map(sx => sx).slice(0, 10);
		
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `Sunucumuzda kayıtsız olan rastgele 10 kişi aşağıda belirtilmiştir.\n\n${uyeler.map((xd, index) => `**${index+1}.** ${xd.toString()} (\`${xd.id}\`)`).join('\n')}`
                    }
                }
            })
        }
    });
});

/////////////////////////////////////////////////////////////////////////

client.on("guildMemberBoost", (member) => {
  const server = member.guild;
  if (server.kanalBul('boost-log')) server.kanalBul('boost-log').send(`${global.emojis.tick} ${member} - \`${member.id}\` kişisi sunucumuza boost bastı.`).catch(e => {});
  if (server.channels.cache.has('745417658228277361')) server.channels.cache.get('745417658228277361').send(`${member} sunucumuza boost bastı! Haydi ona merhaba diyelim.`);
});

client.on("guildMemberUnboost", (member) => {
  const server = member.guild;
  if (server.kanalBul('boost-log')) server.kanalBul('boost-log').send(`${global.emojis.cross} ${member} - \`${member.id}\` kişisi sunucumuzdan boostunu geri çekti.`).catch(e => {});
});

/////////////////////////////////////////////////////////////////////////

mongoose.connect(config.MongoDB, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    client.login(config.Token).then(() => {
        loadCommands();
        loadEvents();
        inlineReply();
        client.setMaxListeners(30)
        require('./src/Patch.js');
        global.ranks = require('./src/Configs/Ranks');
        return Utils.logger('info', 'Discord ile bağlantı kuruldu!');
    }).catch(err => {
      console.log(err)
      return Utils.logger('warn', `Discord ile bağlantı kurulamadı! Hata: ${err}`);
    });

    return Utils.logger('info', 'MongoDB bağlantısı kuruldu!');
});

mongoose.connection.on("error", () => {
    return Utils.logger('warn', 'MongoDB bağlantısı kurulamadı!');
    process.exit(1)
});

client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
    if (member.bot) return;
    let arr = ['<a:middleearth_zipzip:745824537735856268>', '<a:middleearth_zipzipat:761154593790099486>', '<a:middleearth_yoda:793371569991843850>', '<a:middleearth_yellowsunglasses:800089536570196018>', '<:middleearth_tatlkeddy:834498658460237824>']

    await Utils.isimDegistir(member, {name: newNickname.replace(settings.TagliSembol, '').replace(settings.TagsizSembol), age: 'Yok'});
    //if (member.guild.channels.cache.has('745417658228277361')) return member.guild.channels.cache.get('745417658228277361').send(`${arr.random()) ${member}, ${["Yeni ismin harika.", "Havalı bir isim seçmişsin.", "Yeni ismin mükemmel. Yakıyor maşallah!"].random()}`)
});

client
  .on("disconnect", () => Utils.logger('warn', "Bot bağlanısı kesiliyor..."))
  .on("reconnecting", () => Utils.logger('warn', "Bot yeniden bağlanıyor..."))
  .on("error", e => Utils.logger('error', e))
  .on("warn", info => Utils.logger('warn', info));


process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  Utils.logger('error', `(Beklenmedik Hata): ${errorMsg}`)
  //process.exit(1);
});

process.on("unhandledRejection", err => Utils.logger('error', `(Promise): ${err}`));
