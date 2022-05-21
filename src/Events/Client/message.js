const { Message, MessageEmbed } = require("discord.js");
const Settings = require('../../Configs/Settings.js');
const Mesaj = new Map();
const CoinMesaj = new Map();

module.exports = async (message) => {
  if (message.author.bot || !message.channel || message.channel.type == "dm") return;

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    if (Utils.ReklamKontrol(message.content)) {
       message.delete();
       message.channel.send(`${["Bekle", "Dur"].random()}! Sunucumuzda reklam yapamazsın. ${message.member.toString()}`).then(xd => xd.delete({timeout: 2500}));
       return
    };

    /*if (Utils.KufurKontrol(message.content)) {
       message.channel.send(`${["Bekle", "Dur"].random()}! Sunucumuzda küfürlü konuşamazsın. ${message.member.toString()}`).then(xd => xd.delete({timeout: 2500}));
       return message.delete();
    };*/
  };

  /*var iltifatlar = [
      "Sonra mucize diye bir şeyden bahsettiler. Gözlerin geldi aklıma.",
  "Mucizelerden bahsediyordum. Tam o sırda gözlerin geldi aklıma.",
  "Benim için mutluluğun tanımı, seninle birlikteyken geçirdiğim vakittir.",
  "Mavi gözlerin, gökyüzü oldu dünyamın.",
  "Seni gören kelebekler, narinliğin karşısında mest olur.",
  "Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.",
  "Huzur kokuyor geçtiğin her yer.",
  "En güzel manzaramsın benim, seyretmeye doyamadığım.",
  "Seni kelimeler ile anlatmak çok zor. Muhteşem desem yine eksik kalıyor anlamın.",
  "Bu kadar muhteşem olamaz bir insan. Bu kadar kusursuz bu kadar mükemmel.. Kirpiklerinin dizilişi bile sırayla senin.",
  "Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.",
  "Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.",
  "Sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.",
  "Aşk acı ise sen niye tatlısın ?",
  "Mutluluk nedir dediler, yanında geçirdiğim anların anlamını anlatamadım.",
  "Bugün yine o kadar güzelsin ki, gözlerim kamaştı.",
  "Güneş mi doğdu yoksa sen mi uyandın?",
  "Bir gülüşün etrafa ışıklar saçtığını sen de gördüm.",
  "O gülüşündeki gamze olmak isterim güzelliğine güzellik katmak için...",
  "Seni yaşarken yanımda nesneler görünmez yanında, sana küçük buseler atarken hayatla bağlantım kopar o an...",
  "Yürüdüğün yol olmak isterim, hiç aksamadan seni yürütmek için bu hayatta...",
  "Bu mesajımı sana kalbimin en şiddetli sesiyle yolluyorum, seni seviyorum...",
  "Seni özlediğim kadar kimseyi özlemedim, gecelerim kıskanır oldu artık sana çektiğim hasreti biriciğim...",
  "Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum.",
  "Mutluluk nedir sorusuna cevabımsın.",
  "Biraz kilo mu verdin sen? Zayıflamış görünüyorsun. ;)",
  "Kimselere söyleme. Ben ‘Seni’ yazarım, onlar şiir zanneder.",
  "İnsan seni sevince iş güç sahibi oluyor,Bot oluyor mesela.",
  "Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.",
  "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
  "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
  "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
  "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
  "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
  "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
  "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
  "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
  "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
  "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
  "Gülüşün ne güzel öyle- cumhuriyetin gelişi gibi...",
  "Yaşanılacak en güzel mevsim sensin.",
  "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
  "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
  "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
  "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
  "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
  "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
  "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
  "Bir gamzen var sanki cennette bir çukur.",
  "Gecemi aydınlatan yıldızımsın.",
  "Ponçik burnundan ısırırım seni",
  "Bu dünyanın 8. harikası olma ihtimalin?",
  "fıstık naber?",
  "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
  "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
  "Müsaitsen aklım bu gece sende kalacak.",
  "Gemim olsa ne yazar liman sen olmadıktan sonra...",
  "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
  "Sabahları görmek istediğim ilk şey sensin.",
  "Gözlerinle baharı getirdin garip gönlüme.",
  "Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.",
  "Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.",
  "Sen benim yanımda olduğun sürece benim nerde olduğum hiç önemli değil .Kokunu aldığım her yer cennet bana.",
  "Seni her yerde görebileceğim arzusu, belki de bu hayattaki tek yaşama sebebim.",
  "Ateş gibi yakıyorsun ruhun ile beni. Gözlerin adeta ejderha, alev yayıyor etrafa.",
  "Kalbime giden yolu aydınlatıyor gözlerin.  Sadece sen görebilirsin kalbimi. Ve sadece ben hissedebilirim bana karşı olan hislerini.",
  "Sen bu dünyadaki 7 harikadan bile daha harika bir varlıksın. Sen gönlümün ebedi sultanısın.",
  "Aynı zaman diliminde yaşamak benim için büyük ödüldür.",
  "Seni de bu dünyada görünce yaşama sebebimi anladım. Meğer senmişsin beni dünyada yaşamaya zorlayan.",
  "Melek yüzünü gördüğüm ilk an benim olmanı diledim. Şimdi benimsin ve bu bugüne kadar başıma gelen en güzel şey.",
  "Sen benim kabul olmuş en büyük duamsın.",
  "Annemden daha iyi yemek yapıyorsun. :)",
  "Gamzen varsa, aksesuarların en güzeli sende demektir.",
  "Sen benim düşlerimin surete bürünmüş halisin.",
  "Mükemmeli sende gördüm ben.",
  "Gece nasıl sabahı bekliyorsa aydınlanmak için ben de seni öyle bekliyorum.",
  "Gülüşünde nice ilaçlar var yarama merhem olan.",
  "Bir sahil kasabasının huzuru birikmiş yüzüne.",
  "Şey gözlerin çok güzelmiş tanışalım mı ?",
  "sen beni bir de sevgilinken gör",
  "birbirimizi çift görmem için kaç duble daha içmeliyim?",
  "8 milyar gülüş varken seninki favorim",
  "artık benimsin",
  "Oha bu çocuk Türk müüüüüüüüüüüü?",
  "dur beynimi çıkarayım, eşit şartlarda konuşalım",
  "gitsen tek kaybım mal kaybı olur hahaha",
  "bunun adı kalp güzelim. Tersten okuduğun gibi plak değil ki sürekli sende takılı kalsın.",
  "kafamı yaşasan kafana sıkarsın",
  "sanırım seni getiren leyleğin bıraktığı izdi, kuş beyinli olman.",
  "senin için savaşırdım ama verimsiz toprakları feth etmeye gerek yok",
  "birbirimizi çift görmem için kaç duble daha içmeliyim?",
  "azrail bile ayağıma geliyor ne bu tripler?",
  "Buralarda yeniyim de kalbinin yolunu tarif eder misin?",
  "Nasıl yani şimdi sen gerçek misin?",
  "Bunca zaman neredeydin ?",
  "seni seviyorum.",
  "Allah seni yaratmış fakat takip etmiyor sanırım, bu tip ne?",
  "sarılalım mı?",
  "benimle evlenir misin?",
  "azıcık beynini kullan diyeceğim fakat seni zor durumda bırakmak istemiyorum.",
  "akıllara zarar bi mükemmelliğin var",
  "attan indiysek leopar falan gelmiştir ben anlamam eşekten",
  "dedikodu yapalım mı?",
  "iyi ki varsın 💕",
  "şu üstteki aptik ne anlatıyor ya?",
  "o kadar haklısın ki... seni öpesim var",
  "öpşuelimi? çabuk!",
  "yavrum hepsi senin mi?",
  "bi alo de gelmezsem gençliğim solsun.",
  "çok şişkosun.",
  "sevgilim var yazma?",
  "zenginsen evlenelim mi?",
  "halk pazarı gibisin canım sana olan tek ilgim ucuzluğundan",
  "o kadar çok meslek türü varken neden şerefsizlik tatlım?",
  "bu güne aynayı öperek başladım",
  "çok bereketli topraklarımız yok mu? her türlü şerefsiz yetişiyor",
  "taş gibisin!",
  "kalitesizliğinin kokusu geldi...",
  "Şey gözlerin çok güzelmiş tanışalım mı ?",
  "Kalbinin yolunu gösterir misin...",
  "Corona olsan bile sana sarılırdım",
  "Oha sen gerçek misin ?",
  "kahveyi sütsüz seni tereddütsüz seviyorum",
  "senin hava attığın yerde benim rüzgarım esiyor",
  "çok güzel bi tablo gördüm tam alacaktım ama aynaymış...",
  "canım haddin hariç her şeyi biliyorsun",
  "havalar alev gibii, tatile serin bi yerlere gitsene mesela morg?",
  "tavla oynayalım ama sen beni tavla",
  "hava sıcak değil aşkından yanıyorum",
  "konum atta belamızı bulalım bebeğim",
  "üşüdüysen sana abayı yakayım mı?",
  "gel biraz otur yanıma ölünce gidersin",
  "sütüm yarım yağlı mutluluğum sana bağlı",
  "eğer ahtapot olsaydım üç kalbimi de sana verirdim",
  "salağa yatarken uyuya falan mı kaldın?",
  "meleksin ama canımı alıyorsun yoksa Azrailim misin?",
  "ben varya fay hattı olsam kesin daha az kırılırdım",
  "iban at hayallerimi yollayayım harcarsın",
  "ankarada deniz sende karakter",
  "sana hayatım diyorum çünkü o kadar kötüsün",
  "görüşelim mi? mahşer yeri uygun mu?",
  "eşekten yarış atı olmaz ama sen genede koş spor yaparsın",
  "Anlatsana biraz neden bu kadar mükemmelsin?",
  "Nasılsın diye sorma bebeğim, sana göreyim kıpss",
  "Kakaolu sütsün seni sevmeyen ölsün",
  "Ya sen hep böyle hoşuma mı gideceksin ?",
  "Çikolatalı keksin bu alemde teksin",
  "8 milyar gülüş varken seninki favorim",
  "dalin gibi kokuyorsun",
  "seni her gün görenlerin şansından istiyorum",
  "en iyisine layıksın yani bana hıh",
  "ateşimin çıkma sebebi corona değil, sensin",
  "yemeğimi yedim şimdi seni yeme vakti",
  "beni biraz takar mısın?",
  "aklın başına gelir ama ben sana gelmem",
  "sen beni birde sevgilinken gör",
  "naber lan karakter kanseri",
  "soğuk davranacaksan üzerime bir şey alayım?",
  "sana beyin alacam",
  "Allah belanı vermiyor artık ben bir şey yapacağım",
  "artık benimsin",
  "o kadar pubg oynadım böyle vurulmadım",
  "canın yandı mı? cenneten düşerken?",
  "seni mumla ararken elektrikler geldi",
   "burnunda sümük var",
  "Suyun içinde klorür senin kalbinde bir ömür...",
  "Çok tatlı olmayı bırak artık... Kalbim başa çıkamıyor !",
  "Kalbini dinle dediklerinde seni dinleyesim geliyor",
  "Polisi arıyorum çünkü bu kadar tatlı olman yasadışı !",
  "Ölüm ani dünya fani bi kere sevsen nolur ki yani ?",
  "Bana yüzünü dönme gece oluyor sanıyorum.",
  "Güneş aya ben sana tutuldum.",
  "Sana gemi alalım dümende bir numarasın.",
  "AÇILIN DÜNYANIN 8.HARİKASI GELDİ !",
  "Ben küçücük bi botum ama sana kocaman sarılırım",
  "Kafam çok güzel çünkü içinde sen varsın.",
  "Alnın güzelmiş yazısı olabilir miyim ?",
  "Gülüşün şimşek içermiyiz birer milkşeyk ?"
  ];

  const iltifat = iltifatlar[Math.floor((Math.random()*iltifatlar.length))];

  if (message.channel.id == Settings.Channels.Chat) {
      let Numara = Math.floor(Math.random() * 130);
      if (Numara == 98) message.inlineReply(iltifat);
  };*/

  const msgcount = Mesaj.get(message.author.id) || 0;
  if (Settings.Systems.Yetki == true && (msgcount % 4) == 0) {
    if (Settings.Rooms.GecersizChat.includes(message.channel.id)) return;
    Mesaj.set(message.author.id, msgcount+1);
    if (Utils.YetkiliMi(message.member) || message.member.hasPermission("ADMINISTRATOR")) message.member.puanEkle(1);
  } else Mesaj.set(message.author.id, msgcount+1);

  await message.member.coinEkle(1)
  if (Settings.Systems.Gorev == true && Utils.YetkiliMi(message.member)) await message.member.gorevGuncelle('mesaj', 1);
};

module.exports.config = {
    Event: "message"
};
