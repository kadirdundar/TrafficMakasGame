# Görevler

Sırayla yapılacak işler. Her satıra bir görev yaz; en üstteki ilk alınır.
Ayrıntı gerekiyorsa maddenin altına girintili notlar ekle.
Claude `/siradaki` ile ilk Todo maddesini alır, bitirince Done'a taşır.
Tümünü sırayla yaptırmak için `/loop /siradaki` kullan.

## Todo
- Oyun içerisindeki para kazanma ile araç alma özellik ekleme gibi şeyleri optimize et sanki birisi 0 tl ile oyuna başlıyor gibi bu kadar kolay olmasın bir şeyler yapmak ki kişiler oyunda daha fazla kalsın.

## In progress

## Blocked

## Done
- [x] Oyunun performansını arttırmak için yapılabilecek bir şey var mı ? Daha az güç harcamasını sağlayacak şeyler (2026-11-22)
  - Oyun ve garaj en fazla 60 FPS çiziyor (120 Hz ekranlarda iş yarıya iner); Ayarlar → Performans → Pil Tasarrufu: 30 FPS + 1,25x çözünürlük (src/frameCap.js)
- [x] Oyunu app store'a yükleyeceğimizi düşünürsek neler çıkarmamız lazım, örneğin araba markaları ve çizimlerin lisansına gerek olmadığını düşünüyorum markaları başkalaştırıp modelleri o şekilde kullanırız. Bu gibi gereksinimlerin planın olduğu bir dosya oluştur. Ayrıca oyuna farklı neler eklenmesi gerektiğine dair de bilgiler ver. (2026-11-22)
  - Plan: docs/APP-STORE-PLANI.md (lisanslar, marka temizliği, Apple gereksinimleri, kontrol listesi, eklenecekler)
- [x] araç kamerası değişirken üçüncü seçenek dıştan görünüm olsun (2026-11-22)
  - Sıra: Standart → Tam Kabin → Dış Kamera → Yakın Sürüş (kamera butonu, C tuşu ve Ayarlar)
- [x] mercedes araçların birinde ayak koyma yerinde beyaz renkte bir şey var.bu olmasın dikkat çekmemesi için buralar koyu renkte olsun (2026-11-22)
  - C 200'ün pedalları (dokusu kaybolmuş, neredeyse beyaz) koyu mat kauçuk rengine çekildi; yeni cockpit.meshColors ayarı (src/cockpit3d.js)
- [x] sürdüğüm aracın farlarının(sağ sol) birleştiği yer yolda çok belirgin gerçekte böyle değil. daha gerçekci olsun (2026-11-21)
  - Far ışığı deseninde sol/sağ menzil farkı ortada keskin çizgi yerine yumuşak geçişle karışıyor (src/world.js)
- [x] mercedes aracının içerisinde ekran boş duruyor buraya default bir şey yapalım (2026-11-21)
  - C 200'ün orta MBUX ekranına ana ekran: saat, rota haritası + hız, radyo, Navigasyon/Telefon/Araç kutucukları, klima (src/cars/c-class/screen.js)
- [x] arabanın iç ambiyans ışığı daha gerçekci dursun ve default olarak kırmızı renk olsun (2026-11-21)
  - Varsayılan Sport Kırmızı, seçim kaydediliyor; LED şerit ince ışık kılavuzu + yumuşak hâle, gündüz sönük gece parlak (src/cockpit3d.js)
