# App Store Yayın Planı — Otoban Makas 3D

Bu belge oyunu App Store'a çıkarmadan önce yapılması gerekenleri ve sonrasında oyuna
eklenebilecekleri toplar. Tespitler kodun bugünkü hâlinden (2026-11-22) çıkarıldı.

> Hukuki tavsiye değildir. Marka ve lisans kısmı genel bilgidir; ticari yayın öncesi bir
> fikri mülkiyet avukatına kısa bir danışma yapılması önerilir.

---

## 1. Özet: yayını engelleyecek ilk 6 konu

| # | Konu | Neden engel | Yapılacak |
|---|------|-------------|-----------|
| 1 | **Ferrari Portofino modeli CC BY-NC-SA** | "NC" = ticari kullanım yasak. Satın alma veya reklam olan bir uygulamada kullanılamaz. | Aracı çıkar ya da ticari lisanslı/kendi modelinle değiştir. |
| 2 | **Gerçek marka adları, logolar, rozetler** | Apple 5.2.1: izinsiz üçüncü taraf markası → red. | Hayali markalar; logo/rozetleri modellerden ve koddan sil (bkz. 2.2). |
| 3 | **Kaynağı belirsiz içerik** | `public/audi_cockpit.png` fotoğrafı ve Hüzün Radyosu şarkılarının hakları kodda yazmıyor. | Hakları belgele ya da değiştir. |
| 4 | **Test parası açık** | `TEST_MIN_COINS = 1.000.000` her profili 1M paraya tamamlıyor. | `src/progression/config.js` içinde `0` yap. |
| 5 | **Web sitesinin kopyası gibi görünme riski** | Apple 4.2 (asgari işlev): tarayıcıda aynen çalışan uygulamalar sık reddediliyor. | Yerel özellikler ekle (Game Center, titreşim, oyun kumandası, çevrimdışı). |
| 6 | **Gizlilik politikası ve online altyapı** | Her uygulama için gizlilik politikası URL'si zorunlu; online oyun ücretsiz genel PeerJS sunucusuna bağlı. | Politika yaz; kendi PeerJS sunucunu kur. |

---

## 2. Lisans ve marka

### 2.1 "Markayı değiştirirsek lisansa gerek yok" fikri hakkında

Doğru olan kısım: Oyunlardaki yaygın yol budur. Adı değiştirilmiş, logosu silinmiş arabalar
(ör. "Audi" yerine hayali bir marka) çoğu bağımsız oyunda kullanılıyor.

Eksik kalan iki nokta:

1. **3D modelin kendi lisansı ayrı bir konu.** Sketchfab'den alınan her model, onu yapan
   kişinin telif hakkı altında. Markayı değiştirmek bu lisansı ortadan kaldırmaz. CC BY
   modellerde künye (yazar adı, lisans, bağlantı) uygulamada gösterilmeye devam etmeli.
   NC (ticari olmayan) lisanslı model ise markası değişse de ticari uygulamada kullanılamaz.
2. **Bazı tasarımlar adı olmadan da tanınır ve korunur.** Porsche 911 silueti, Ferrari'ler ve
   G-Serisi gibi ikonik gövdeler bazı ülkelerde tasarım/şekil markası olarak tescilli. Sadece
   adı değiştirmek bu riski tam kaldırmaz. En tanınır gövdelerde ızgara, far ve stop
   şekillerini belirgin biçimde değiştirmek ya da bu araçları genel tasarımlı modellerle
   değiştirmek daha güvenli.

### 2.2 3D modeller (garaj + trafik)

Trafik araçları garaj modellerinin aynısı (`public/models/traffic/`), lisansları da aynı.

| Araç | Yazar (Sketchfab) | Lisans | Ticari kullanım | Durum |
|------|-------------------|--------|-----------------|-------|
| Audi A8 | everhard | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| BMW M4 CS | BMW'S Lost Proxy | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği; "VR46 Edition" adı da marka |
| Mercedes-AMG GT | RES1N | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| Brabus G700 | Mixmamo.studio | CC BY 4.0 | Evet (künye ile) | Marka/logo + G-Serisi gövde riski |
| Porsche 911 | DisneyCars | CC BY 4.0 | Evet (künye ile) | Marka/logo + 911 silueti riski |
| Toyota Corolla | Armored Wave | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| Ford Focus | BHP3D | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| VW Passat B5 | romanian_guy_0069 | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| VW Passat B8 | romanian_guy_0069 | CC BY 4.0 | Evet (künye ile) | Marka/logo temizliği |
| Mercedes C 200 | KOElkast1007 | Sketchfab Free Standard | Genelde evet; **koşulları sketchfab.com/licenses'tan doğrula** | Marka/logo temizliği |
| **Ferrari Portofino** | Ddiaz Design | **CC BY-NC-SA 4.0** | **Hayır** | **Çıkar ya da değiştir** |

Not: Model yazarları bazen gerçek araç markalarını kullanma hakkına sahip olmadıklarını
açıkça belirtir. CC lisansı yalnızca yazarın kendi emeğini kapsar, otomobil üreticisinin
marka haklarını kapsamaz.

### 2.3 Koddaki marka izleri (temizlenecekler)

Kodda marka adı geçen dosyalar: `index.html`, `src/cars/*/car.js`, `src/cars/*/convert.mjs`,
`src/cars/*/painters.js`, `src/cars/c-class/screen.js`, `src/cars/portofino/screens.js`,
`src/cockpit.js`, `src/main.js`, `src/world.js`, `src/replay.js`, `src/audio.js`,
`src/progression/drivetrain.js`, `src/cars/index.js`.

- [ ] **Araç adları:** her `car.js` içinde `label`, `make`, `model`, `variant`, `aliases`
      (ör. `MERCEDES-AMG`, `G 700`, `911 TARGA 4S`, `M4 CS`, `VR46 Edition`).
- [ ] **Gösterge yazıları:** `src/cockpit.js` → `CLUSTER_LETTERING` (`AMG`, `BRABUS`,
      `PORSCHE`, `TOYOTA`, `Ford`, `FERRARI`), Audi halkaları ve VW logosu çizimi.
- [ ] **Ekran çizimleri:** `src/cars/portofino/screens.js` (Ferrari göstergesi),
      `src/cars/c-class/screen.js` (`MBUX` yazısı), `src/cars/*/painters.js`
      (direksiyon tuşları; Mercedes yıldızı ve benzeri simgeler).
- [ ] **Modellerin dokuları:** dış modellerdeki ızgara/bagaj rozetleri, jant göbekleri,
      direksiyon ortasındaki logolar (C 200 ve Brabus'ta Mercedes yıldızı, A8'de Audi
      halkaları açıkça görünüyor). Ya `convert.mjs` adımında ilgili ağlar silinip yerine
      düz kapak konacak ya da dokular üzerine boyanacak.
- [ ] **Plakalar:** "34 MKS 34" gibi hayali plakalar sorun değil.
- [ ] **Mağaza sayfası:** uygulama adı, açıklama, anahtar kelimeler ve ekran görüntülerinde de
      marka adı veya logosu olmamalı (anahtar kelimelerde marka adı ayrıca reddedilme nedenidir).

### 2.4 Sesler, müzik, görseller

| İçerik | Kaynak | Lisans | Durum |
|--------|--------|--------|-------|
| Motor sesleri (`public/audio/engines`) | Freesound: Lumamorph, lonemonk | CC BY 4.0 | Uygun, künye gerekli |
| Menü müziği (`public/music/menu-theme.mp3`) | Kevin MacLeod, "Neon Laser Horizon" | CC BY 4.0 | Uygun, künye gerekli |
| Hüzün Radyosu (3 şarkı, `public/radio/`) | Kodda yazmıyor | **Bilinmiyor** | Hakların sende olduğunu belgele. Yapay zekâ ile üretildiyse o aracın ticari kullanım şartlarını kontrol et. |
| Kokpit fotoğrafı (`public/audi_cockpit.png`) | Kodda yazmıyor | **Bilinmiyor** | 3D kokpit yüklenene kadar görünen 2D yedek. Kendi çizimin değilse kaldır veya değiştir; içinde Audi logosu da var. |
| Uygulama ikonu (`public/icons/`) | Proje | — | Marka içermediğini kontrol et. |

- [ ] Oyundaki künye ekranı (Rehber → model künyeleri) bugün 3D modelleri listeliyor.
      **Motor sesleri ve menü müziği de** eklenmeli (CC BY künye ister).

---

## 3. Apple'ın teknik ve idari gereksinimleri

### 3.1 Paketleme

Oyun bir web uygulaması (Vite + Three.js). App Store için yerel bir kabuk gerekiyor.
Önerilen yol: **Capacitor** (WKWebView içinde çalışır, yerel eklentilere erişir).

- [ ] Capacitor projesi kur (`npx cap add ios`), `dist/` çıktısını uygulamaya göm.
- [ ] Tüm modeller, sesler ve müzik **uygulamanın içinde** olsun (internetsiz açılsın).
      Bugün radyo ve modeller ağdan akıyor; uygulamada yerel dosyadan yüklenmeli.
- [ ] **Xcode 26 / iOS 26 SDK** ile derle: 28 Nisan 2026'dan beri App Store Connect bunu şart
      koşuyor. Bu, eski iOS sürümlerini desteklemeye engel değil.
- [ ] Asgari iOS hedefi: Apple 9 Eylül 2026'dan itibaren en az iOS 13 istiyor; kullanılacak
      Capacitor sürümünün kendi alt sınırı genelde bundan yüksek (kurarken kontrol et).
      WebGL 2 performansı için iOS 16+ makul bir hedef.
- [ ] Ekran yönü: oyun yatay; `Info.plist` içinde yalnızca yatay yönler.
- [ ] iPad desteği isteniyorsa iPad ekran görüntüleri de gerekir.

### 3.2 "Asgari işlev" (Guideline 4.2) riski

Tarayıcıda aynen çalışan uygulamalar sıkça "web sitesinden farkı yok" gerekçesiyle
reddediliyor. Oyun içeriği güçlü olsa da yerel özellikler riski azaltır:

- [ ] **Game Center:** skor tabloları (en uzun mesafe, en yüksek skor, makas sayısı) ve başarımlar.
- [ ] **Titreşim (haptics):** makas, kaza, ABS ve vites geçişlerinde.
- [ ] **Oyun kumandası:** MFi / PlayStation / Xbox kumanda desteği (Game Controller framework).
- [ ] **Çevrimdışı oynanış** (bkz. 3.1).
- [ ] İsteğe bağlı: iCloud ile kayıt eşitleme.

### 3.3 Gizlilik

- [ ] **Gizlilik politikası URL'si** (zorunlu). Mağaza sayfasına ve oyunun Ayarlar ekranına.
- [ ] **Gizlilik etiketi (App Privacy):** bugün veri yalnızca cihazda (localStorage). Online
      modda ise:
  - oyuncu adı diğer oyunculara gidiyor,
  - WebRTC bağlantısı **IP adreslerini** diğer oyunculara ve PeerJS/STUN sunucularına açıyor.
  Bu, etikette "veri toplanmıyor" demeyi zorlaştırır; dürüstçe beyan edilmeli.
- [ ] **Online altyapı:** `src/multiplayer.js` PeerJS'in **ücretsiz genel sunucusunu** ve
      Google'ın STUN sunucularını kullanıyor. Genel sunucu üretim için uygun değil (kesinti,
      sınır). Kendi PeerServer'ını kur; zor ağlar (mobil operatör) için bir TURN sunucusu ekle.
- [ ] **Kullanıcı içeriği (Guideline 1.2):** oyuncu adları başkalarına görünüyor. Küfür
      filtresi ve oyuncuyu engelleme/şikâyet etme seçeneği eklenmeli.
- [ ] Hesap sistemi yok; bu yüzden "hesap silme" zorunluluğu şimdilik yok. İleride hesap
      eklenirse uygulama içinden silme şart.

### 3.4 Para ve satın alma

- [ ] `TEST_MIN_COINS` → `0` (`src/progression/config.js`).
- [ ] Para şu an yalnızca oynayarak kazanılıyor; sorun yok. **Gerçek parayla para/araç
      satılacaksa Apple'ın uygulama içi satın alması (IAP) zorunlu** (Guideline 3.1.1);
      başka ödeme yöntemi veya bağlantı kullanılamaz.
- [ ] Reklam eklenecekse: App Tracking Transparency izni, gizlilik etiketinin güncellenmesi
      ve yaş derecelendirmesine etkisi.

### 3.5 App Store Connect

- [ ] Apple Developer Program üyeliği (yıllık ücretli).
- [ ] **Yaş derecelendirmesi:** Apple 2025'te dereceleri değiştirdi (4+, 9+, 13+, 16+, 18+);
      yeni anketi doldur. Kaza sonrası yanan araç ve online oyuncularla etkileşim cevapları
      etkiler; büyük ihtimalle 9+ ya da 13+.
- [ ] **AB tüccar statüsü** (Digital Services Act): AB'de yayın için tüccar olup olmadığını
      beyan etmek gerekiyor; tüccarsan adres ve iletişim bilgisi mağazada görünür.
- [ ] **Şifreleme beyanı:** yalnızca standart HTTPS/WebRTC şifrelemesi kullanılıyorsa
      `ITSAppUsesNonExemptEncryption = NO`.
- [ ] Mağaza sayfası: ad, alt başlık, açıklama (TR + EN), anahtar kelimeler, destek URL'si,
      ekran görüntüleri (6,9" ve 6,5" iPhone; iPad destekleniyorsa 13"), isteğe bağlı tanıtım videosu.
- [ ] TestFlight ile dış test.

---

## 4. Yayın öncesi kontrol listesi (sırasıyla)

1. [ ] Portofino'yu çıkar ya da değiştir.
2. [ ] Tüm araçlarda hayali marka adları; koddan ve dokulardan logo/rozet temizliği.
3. [ ] `audi_cockpit.png` ve radyo şarkılarının haklarını netleştir.
4. [ ] Künye ekranına sesleri ve müziği ekle.
5. [ ] `TEST_MIN_COINS = 0`.
6. [ ] Capacitor kabuğu, içeriği uygulamaya gömme, çevrimdışı açılış.
7. [ ] Game Center + titreşim + kumanda.
8. [ ] Kendi PeerServer'ı + TURN; ad filtresi ve engelleme.
9. [ ] Gizlilik politikası, gizlilik etiketi, yaş anketi, AB tüccar beyanı.
10. [ ] Performans/pil ayarları (Todo'daki performans görevi), eski iPhone'larda test.
11. [ ] Mağaza görselleri ve metinleri, TestFlight, gönderim.

---

## 5. Oyuna eklenebilecekler

Öncelik, hem oyuncunun geri gelmesine hem de App Store incelemesine katkısına göre.

### Yüksek öncelik
- **Günlük görevler ve haftalık meydan okumalar:** "fren yapmadan 5 km", "10 kez yakın makas",
  "gece 200 km/s üstü 1 dakika". Tamamlayınca para; oyuncuyu her gün geri getirir.
- **Game Center skor tabloları ve başarımlar:** hem eğlence hem 4.2 için yerel özellik.
- **İngilizce dil desteği:** bugün her şey Türkçe; mağazanın çoğu İngilizce. Metinleri tek
  bir dil dosyasına topla.
- **Grafik/pil ayarı:** "Pil tasarrufu" modu (30 FPS, düşük çözünürlük, gölgesiz). Telefonda
  uzun oturumlar için önemli.
- **Oyun kumandası desteği.**

### Orta öncelik
- **Kariyer/seviye sistemi:** sürüş puanıyla seviye atlama; yeni araçlar ve parçalar seviyeyle açılsın.
- **Yeni haritalar:** sahil yolu, dağ geçidi, yağmurlu şehir içi, tünel ağırlıklı bir otoban.
- **Yeni modlar:** zamana karşı (checkpoint), "hiç çarpmadan" hayatta kalma, trafik yoğunluğu
  giderek artan mod, polis kovalamacası.
- **Fotoğraf modu:** dış kamerada durdurup açı/filtre seçme, paylaşma (dron tekrarı zaten var).
- **Arkadaş skorları ve hayalet araç:** arkadaşının en iyi sürüşünü hayalet olarak görmek.
- **Ses paketi:** egzoz/turbo yükseltmesiyle değişen motor sesi.

### Düşük öncelik / ileride
- **iCloud kayıt eşitleme** (iPhone ↔ iPad).
- **Kozmetik satış (IAP):** boya kaplamaları, neon, jant paketleri. Oyunu satın almaya zorlamadan.
- **Erişilebilirlik:** renk körü dostu HUD renkleri, yazı büyüklüğü, tek elle kontrol seçeneği.
- **Hava olayları:** sis, kar, gün batımı sonrası ıslak zemin yansımaları.

---

## Kaynaklar

- Apple, SDK asgari gereksinimleri: https://developer.apple.com/news/upcoming-requirements/
- Apple, yaş derecelendirmesi güncellemesi: https://developer.apple.com/news/?id=ks775ehf
- Apple, yaş dereceleri (App Store Connect Yardım): https://developer.apple.com/help/app-store-connect/reference/age-ratings
- Apple, App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Sketchfab lisansları: https://sketchfab.com/licenses
- Creative Commons BY-NC-SA 4.0: https://creativecommons.org/licenses/by-nc-sa/4.0/
