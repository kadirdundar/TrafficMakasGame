# Oyuna yeni araç modeli ekleme tarifi (Audi A8 standardı)

Bu belge, bir aracın 3D modelini (dış görünüm + kokpit) Otoban Makas'a **Audi A8 kalitesinde**
eklemek için izlenecek yolu anlatır. İnsanlar ve yapay zekâ ajanları için yazılmıştır. BMW
eklenirken yaşanan hataların tamamı (bkz. "Bilinen tuzaklar") bu tarife uyulmadığı için oluştu.

Kısa özet: **Kaynak modeli seç → çevrimdışı temizle ve sözleşmeye göre adlandır → sadeleştir ve
sıkıştır → kodda tek bir config ile bağla → önizleme araçlarıyla ekran görüntüsü alarak doğrula.**

---

## 0. Dosyalar ve sorumluluklar

| Ne | Nerede |
| --- | --- |
| Araç kaydı (her şeyin ayarı) | `src/cars/<id>/car.js` — alanlar: [`src/cars/README.md`](../src/cars/README.md) |
| Dış model (garaj + online arkadaşlar) | `public/models/<arac>.glb`, ayarlar `car.js` → `exterior`, genel yükleyici `src/cars/loadExterior.js` |
| Kokpit modeli (sürüş görünümü) | `public/models/<arac>-cockpit.glb`, ayarlar `car.js` → `cockpit`, yükleyici `src/cockpit3d.js` |
| Gösterge paneli çizimi | `src/cockpit.js` → `paint3DScreen()`, `car.js` → `cockpit.cluster` (`'audi'` / `'bmw'`) |
| Garaj düğmesi, başlık, künye | `car.js` → `label`, `make`, `model`, `variant`, `credit` (garaj bunlardan üretilir) |
| Dönüştürme ayarı | `src/cars/<id>/convert.mjs`, araç: `npm run car:convert -- <id>` |
| Yeni araç iskeleti / inceleme | `npm run car:new -- <id> <kaynak.glb>`, `npm run car:inspect -- <glb>` |
| Ölçüm | `tools/model-preview/lab.html?car=<id>` (tıklayarak ölç, ayar satırı üretir) |
| Önizleme / doğrulama | `tools/model-preview/` (aşağıda §6) |

Ham kaynak modeller repoya girmez (`model-kaynak/` gitignore'da); sadece optimize edilmiş GLB'ler
`public/models/` altına girer.

## 1. Koordinat sözleşmesi (her model buna uymalı)

- Birim **metre**, **+Y yukarı**, aracın **burnu -Z yönünde**. Sağ = +X.
- Dış model: uzunluk Z ekseninde **4.85 m**'ye normalize edilir, tekerlekler **y = 0**'a oturur,
  X ve Z'de ortalanır (`src/cars/loadExterior.js`, `exterior.length`).
- Kokpit: model, sürücünün gözü kameranın `eyeAnchor` noktasına (bkz. `CAMERA_PRESETS` in
  `main.js`, varsayılan `(0, 1.25, 0.2)`) denk gelecek şekilde yerleştirilir. `defaultEye`, gözün
  model içindeki konumudur.
- Kaynak model +Z'ye bakıyorsa dönüşü **tek yerde** yap (GLB'yi çevrimdışı döndür ya da config'te
  `rotationY: Math.PI`). Dönüşten sonra sol/sağ değiştiği için sol kapı, sürücü tarafı, ayna
  eşlemesi gibi her şeyi bir kez daha kontrol et.

## 2. Kaynak model seçimi (en kritik adım)

Kötü kaynak, kodla düzeltilemeyen sorunlar üretir. Seçmeden önce kontrol et:

1. **Dış ve kokpit aynı araç olsun.** BMW'de dış model 3 Serisi (G20), kokpit M8 (F92), menüdeki
   ad ise "520 G30". Bunu yapma; ya aynı modeli kullan ya da adlandırmayı modele uydur.
2. **Kokpitte gerçek kabin kaplamaları olsun:** A/B direk iç kaplamaları, tavan döşemesi,
   güneşlikler, iç ayna, kapı panelleri, gösterge yüzeyi. Oyun içinden çıkarılmış (ripped)
   modellerde bunlar çoğu zaman yoktur; direkler sadece dış sacın arkadan görünen ince kabuğudur
   ve geceleri yolla aynı renkte, "görünmez" olur. (BMW M8 kokpitinde tam olarak bu oldu; §5.6.)
3. Dokular gerçek renkli olsun. "ColourZone" gibi beyaz detay haritaları + oyun motorunun
   boyadığı renk bölgeleri kullanan modellerde renkleri kendin vermen gerekir (§5.4).
4. Lisans: CC BY ise yazar adı ve lisans `index.html` → `.asset-credits` satırına eklenmeli
   (A8 örneği: "Audi A8 Custom 2018" — everhard, CC BY 4.0).
5. Varyant parçalar (aynı aynanın 4 farklı versiyonu, karbon/siyah tavan, body kit) mümkünse
   çevrimdışı silinmeli; silinmediyse `hideVariants` ile gizlenir (§5.5).

## 3. Çevrimdışı hazırlama (A8'e uygulanan işlem)

A8 dış modeli bu şekilde hazırlandı: iç mekân silindi, 774k → **57k üçgen**, **13 draw call**,
meshopt sıkıştırma, 512 px WebP dokular, toplam **~0.55 MB**. Kokpit: ~62k üçgen, ~1 MB.

Hedef bütçe (mobilde 60 FPS için):

| | Dış model | Kokpit |
| --- | --- | --- |
| Üçgen | ≤ 60k | ≤ 65k |
| Draw call (≈ malzeme sayısı) | ≤ 15 | ≤ 30 |
| Doku | 512 px (detaylı yüzeyler 1024), WebP | aynı |
| Dosya | < 1 MB | ~1 MB |

Bu adımların hepsi `npm run car:convert -- <id>` ile yapılır; ayarlar `src/cars/<id>/convert.mjs`
içindedir (alanlar: [`src/cars/README.md`](../src/cars/README.md)). Blender sadece betiğin
yapamadığı temizlik (ör. varyant parçaları silmek, iç mekân ile dışı ayırmak) için gerekir.
Elle yapmak gerekirse işlem sırası:

1. **Temizlik (Blender):** görünmeyen parçaları sil (dış modelde iç mekân ve motor; kokpitte motor,
   bagaj, alt takım), varyantları sil, uygulanmamış dönüşümleri uygula (Apply Transform), ölçeği
   metreye getir, yönü sözleşmeye çevir.
2. **Sözleşmeye göre adlandır** (kod adları bekler, §4–§5):
   - Dış model malzemeleri: `paint` (boya, oyuncu rengiyle değiştirilir), `glass`, `lens`,
     `headLight*`, `tailLight*`, `tailLens`, `chrome`, `blackGloss`, `blackMatte`, `tire`, `badge`.
   - Kokpit düğümleri: direksiyon tek düğüm `steering_wheel`, extras'ta
     `{"pivot":[x,y,z],"axis":[x,y,z]}` (göbek merkezi ve kolon ekseni); aynalar `mirror_left`,
     `mirror_center`, `mirror_right` (sadece ayna camı yüzeyi).
   - **Önü ve arkası tek mesh'te olan lamba parçalarını ayır.** Ön farlar ve stoplar aynı mesh'teyse
     kod ikisini aynı renkte yakar (BMW'de stoplar beyaz yandı).
3. **Sadeleştir:** önce `weld` + `dedup`, sonra `simplify`. **Gövde panellerini düşük hatayla
   sadeleştir** (ör. `error ≈ 0.0005`, `lockBorder`); fazla sadeleştirilmiş gövde parlak boyada
   dalgalı/yamuk yansıma verir (BMW'de kaputta oldu). Lastik, iç mekân, alt takım daha agresif
   sadeleşebilir.
4. **Aynı malzemeli mesh'leri birleştir** (`join`) → draw call düşer.
5. **Dokular:** `resize` 512 (gerekirse 1024) + `webp`.
6. **Sıkıştır:** `quantize` + `meshopt`. Çalışma zamanında `MeshoptDecoder` zaten kullanılıyor.

Örnek (gltf-transform CLI; sürümü projedeki kütüphaneyle aynı tut):

```bash
npx @gltf-transform/cli@4 weld in.glb tmp1.glb
npx @gltf-transform/cli@4 dedup tmp1.glb tmp2.glb
npx @gltf-transform/cli@4 simplify tmp2.glb tmp3.glb --ratio 0.1 --error 0.0005 --lock-border
npx @gltf-transform/cli@4 join tmp3.glb tmp4.glb
npx @gltf-transform/cli@4 resize tmp4.glb tmp5.glb --width 512 --height 512
npx @gltf-transform/cli@4 webp tmp5.glb tmp6.glb
npx @gltf-transform/cli@4 meshopt tmp6.glb public/models/arac.glb
```

Sonuçta üçgen/malzeme sayısını ve sınır kutusunu kontrol et:
`node tools/inspect-glb.mjs <dosya.glb> [ölçek] [180°=1]` her mesh için malzeme, üçgen sayısı ve
dünya koordinatında sınır kutusu yazar (ya da `npx @gltf-transform/cli@4 inspect`).

## 4. Dış model (`car.js` → `exterior`)

Kod yazılmaz; genel yükleyici (`src/cars/loadExterior.js`) ayarları okur ve
`{ group, bodyMat, setLights({ night, braking, highBeam }) }` döndürür. Garaj `bodyMat.color` ile
boyayı değiştirir. Alanlar: [`src/cars/README.md`](../src/cars/README.md).

1. **Normalize et** (§1).
2. **Boya:** `paint` malzemesini `MeshPhysicalMaterial` (metalness ~0.82, roughness ~0.22,
   clearcoat 1, clearcoatRoughness 0.05) ile değiştir.
3. **Lambalar:** far malzemelerinde `emissive` beyaz (+ `emissiveMap = map`), stoplarda kırmızı.
   Yoğunluklar `HEAD = { day: 0.5, night: 1.6, highBeam: 3.2 }`, `TAIL = { day: 0.35, night: 1.1,
   brake: 3.0 }`.
4. **Işık haleleri (glow):** konumları **elle yazma**; far ve stop mesh'lerinin sınır kutusundan
   hesapla (`lamps[].box` + `glow.*.from`); ölçülmüş sabit nokta gerekiyorsa `glow.*.at`.
5. Kaynak, sözleşmeye göre hazırlanamadıysa çalışma zamanında yamala (BMW örneği):
   `splitFrontRear()` ile lamba mesh'ini öne ve arkaya böl, `smoothNormals()` ile gövde
   normallerini yumuşat (çevrimdışı düzeltme her zaman daha iyidir).

## 5. Kokpit (`car.js` → `cockpit`)

Her araç için tek bir config nesnesi doldurulur. Değerleri tahmin etme; modelden ölç (§6'daki
`pick` / `hl` modları ve mesh sınır kutuları).

### 5.1 Göz noktası (`defaultEye`): en sık yapılan hata

Ergonomi kuralı: **göz, direksiyon göbeğinin ~0.50–0.55 m arkasında ve ~0.25–0.31 m üstünde**,
koltuk merkezinin X'inde, koltuk başlığının ~0.12–0.15 m önünde olmalı. A8: 0.51 m arka /
0.23 m üst. BMW ilk eklendiğinde 0.31 m arkadaydı; direksiyon ve torpido ekranı kapladı.
Doğrulama: üç kamera açısında da (Standart / Tam Kabin / Yakın Sürüş) ve dikey ekranda
direksiyonun üst kenarı gösterge panelinin altında kalmalı, yol ön camın yaklaşık üst yarısını
doldurmalı.

### 5.2 Direksiyon

`steering_wheel` düğümü + `pivot` (göbek merkezi) + `axis` (kolon yönü, sürücüye doğru).
Model hazır değilse BMW bloğundaki gibi `steer` adlı mesh'ler bir pivot grubuna toplanır.
`steerSign` ile pozitif direksiyon açısında A8 ile **aynı yöne** döndüğünü doğrula
(önizlemede `steer` parametresi).

Direksiyonun parçaları başka mesh'lerde de olabilir (BMW: karbon kollar ve vites pedalları karbon
mesh'inde, logo iç mekân mesh'inde). Direksiyon diskinin tamamen içinde kalan bağlı parçaları
direksiyon düğümüne taşı (`convert-m4.mjs` → "Wheel trim"); yoksa direksiyon dönerken yerinde
kalırlar. Sinyal kolu gibi kolon parçaları diskin arkasındadır ve sabit kalmalıdır.

### 5.3 Ekranlar ve aynalar

- `screens.cluster`: gösterge camının 4 köşesi (`tl/tr/bl/br`, sürücünün gördüğü yönde sol/sağ)
  ve normali `n`; değerleri gösterge mesh'inin sınır kutusundan al. Gösterge içeriği **markaya
  özel** çizilmeli (`paint3DScreen` içinde `carType` dalı); BMW'de Audi halkaları çizilmişti.
- Gösterge dörtgeni modelin kendi gösterge camının **önünde** olmalı. Cam kavisliyse dörtgeni
  kenarlardan ölç (kenarlar sürücüye daha yakındır); aksi halde dörtgen camın arkasında kalır ve
  modelin sabit dokusu görünür (BMW'de "P" yazan statik gösterge göründü).
- Aynalar: sadece ayna camı mesh'ine `applyMirror` uygulanır; sol ayna `u ∈ [0.55, 1]`, sağ
  `[0, 0.45]`, iç ayna `[0, 1]`. Elle dörtgen yerleştirme; modelin kendi ayna camı üçgenlerini
  ayır (BMW: atlastaki düz gri UV adası, `convert-m4.mjs` → `MIRRORS`). Elle konan dörtgenler
  gövdenin arkasında kalıp aynaları "ölü" bıraktı.
- three.js `GLTFLoader` düğüm adlarındaki `.` karakterini siler: `mirror_L.001` → `mirror_L001`.

### 5.4 Malzemeler (`tints`, `softMaterials`)

- Deri/döşeme yüzeylerinde metalness ~0.05, roughness 0.6–0.8.
- Beyaz detay haritalı "ColourZone" malzemelerine renk ver (`tints`). Gece kabin parıltısı
  (`emissiveMap = map`) tint rengini kullanır.
- Ön camdan görünen kaput ve çamurluklar koyu metalik boya olmalı (A8'deki `paint` gibi).

### 5.5 Gizlenecekler (`hideVariants`)

Alt dize eşleşmesidir, **kısa parçalar tehlikelidir** (ör. `'cs'` adında `cs` geçen her şeyi
gizler). Mümkün olduğunca tam mesh adı kullan. Görünmeyen motor vb. de burada gizlenir.

### 5.6 A direkleri ve tavan döşemesi

Kabin kaplaması olmayan modellerde (BMW M8) direkler, gövde sacının arkadan görünen ince
kabuğudur: neredeyse görünmez ve geceleri yolla aynı renktedir. Çözüm (`cockpit3d.js`):

- `pillarEdge`: ön cam mesh'inin yan kenarından çıkarılan nokta dizisi (sol taraf; sağ taraf
  aynalanır). `pillarSpan`: cam kenarından yan cam kenarına uzanan vektör.
  `createPillarTrim()`, bu kenar boyunca kabine doğru kavisli bir kaplama üretir.
- `skinMesh`: içeriden görünen gövde kabuğu, tavan döşemesi malzemesine (`trimColor`, antrasit,
  hafif emissive) çevrilir.
- Kaynak modelde iç kaplamalar varsa bunlara gerek yoktur; A8'de yoktur.

### 5.6b Okunamayan küçük detaylar (`atlasPatches`, `satinPieces`)

Oyundan çıkarılmış atlaslarda düğmeler, kapı açma kolu ve logolar birkaç düzine piksele sıkışır;
sürücü koltuğundan gri leke gibi görünür. `src/cockpitDecals.js`:

- `atlasPatches`: bir UV kutusuna düşen üçgenler kendi yüksek çözünürlüklü canvas'ına taşınır ve
  keskin olarak yeniden çizilir (BMW: klima düğme şeridi, kapı kilit düğmeleri, direksiyon logosu).
  Canvas atlasla aynı yerleşimdedir; ters eşlenmiş bölgeler için `flipV`, UV'si karışık logolar
  için `project` (direksiyon eksenine düzlemsel izdüşüm) kullan.
- `satinPieces`: tek bir bağlı parçaya (BMW: kapı açma kolu) metal malzeme verir.
- UV kutularını `pick` modunun yazdığı `uv=` değerlerinden ölç; sonucu yakın kamerayla
  (`ext`, `look`, `fov`) kontrol et.

### 5.7 Ambiyans LED'leri (`ledPaths`)

Model kendi ambiyans şeritlerini atlasta (ör. mavi) boyanmış olarak içeriyorsa tüp LED ekleme:
o üçgenleri çevrimdışı `ambient_led` mesh'ine ayır (BMW: doku pikseli mavi olan üçgenler);
`cockpit3d.js` bunları ambiyans rengiyle, atlastaki parlaklık geçişini maske olarak kullanarak
yakar. Yoksa noktaları göz kararı verme; yüzeye ışın atarak ölç (`pick` modu ya da `Raycaster`)
ve yüzeyin ~0.5–1 cm önüne koy. Uygun yerler: kapı panelindeki dikiş çizgisi, torpidonun yolcu tarafındaki
kaplama birleşimi. Direksiyonun arkasından geçen bir LED havada asılı görünür.

## 6. Doğrulama: ekran görüntüsü almadan "bitti" deme

`tools/model-preview/` (geliştirme sunucusu açıkken: `npm run dev`):

- `lab.html?car=<id>[&model=source|cockpit|exterior]`: ölçüm sayfası. Modele tıklayınca düğüm,
  malzeme, nokta, UV ve parça bilgisi; araçlar direksiyon göbeği/ekseni/göz noktası (3 nokta),
  gösterge köşeleri (4 nokta), ayna camı ve bulanık detay UV kutuları (aynı düz yüzey + aynı
  renk adası), metal parça, ambiyans şeridi ve `keepNodes` satırlarını hazır yazar. Yeşil ok
  aracın burnunu (-Z) göstermeli.

- `car.html?car=bmw&az=-2.3&pol=1.3&dist=9.5[&night=1&brake=1&high=1]`: dış model, açı ve
  ışıklarla.
- `cockpit.html?car=bmw&preset=0|1|2[&night=1&w=720&h=1280&steer=0.8]`: sürücü koltuğundan,
  oyundaki kamera ve ortam ışığıyla aynı ayarlarla.
  - `ext=x,y,z&look=x,y,z`: serbest hata ayıklama kamerası.
  - `hl=<mesh adı parçası>`: eşleşen mesh'leri pembe boyar.
  - `pick=px,py;px,py`: o ekran piksellerine hangi mesh'in (ön/arka yüz) denk geldiğini yazar.
- `shot.mjs`: sayfaları başsız (headless) Chromium ile çalıştırıp PNG kaydeder:

```bash
node tools/model-preview/shot.mjs /tmp/out '[["dis","car=bmw"],["kokpit","car=bmw&preset=0","cockpit.html"]]'
```

GPU'suz ortamlarda SwiftShader bayrakları scriptin içinde. `CHROMIUM_PATH` ile tarayıcı yolu
verilebilir.

Kontrol listesi (A8 ile yan yana karşılaştır):

- [ ] Dış: ¾ ön, yan, ¾ arka; gündüz ve gece; fren ve uzun far. Gövde yansımaları pürüzsüz,
      stoplar kırmızı, haleler lambaların üzerinde.
- [ ] Kokpit: 3 kamera açısı + dikey ekran + gece. Direksiyon, gösterge, A direkleri, aynalar ve
      tavan seçilebiliyor; hiçbir yerden yol veya gökyüzü "delikten" görünmüyor.
- [ ] Direksiyon dönüş yönü A8 ile aynı.
- [ ] Gösterge panelinde doğru marka.
- [ ] Yükleme süresi ve draw call bütçe içinde; `npm run build` hatasız.
- [ ] Gerçek oyunda (garaj + sürüş) bir ekran görüntüsü.

## 7. Bilinen tuzaklar (BMW'de yaşananlar)

| Belirti | Sebep | Çözüm |
| --- | --- | --- |
| Direksiyon ve torpido ekranı kaplıyor | `defaultEye` direksiyona 31 cm uzaklıktaydı | §5.1 ergonomi kuralı |
| BMW göstergesinde Audi halkaları | Tek gösterge çizimi vardı | `carType` dalı, markaya özel çizim |
| Arka stoplar beyaz/pembe yanıyor | Far camı ve stop aynı mesh'te | Ön/arka böl (`splitFrontRear`) ya da çevrimdışı ayır |
| Hale ışıkları gövdenin dışında | Konumlar elle yazılmış | Sınır kutusundan hesapla |
| Kaputta dalgalı yansıma | Gövde fazla sadeleştirilmiş | Düşük hatalı simplify; çalışma zamanında `smoothNormals` |
| A direkleri görünmüyor / yolla aynı renk | Kokpit modelinde iç kaplama yok, sadece dış sacın arka yüzü | §5.6 |
| LED şerit havada | Noktalar göz kararı verilmiş | Işın atarak ölç (§5.7) |
| Koltuklar bembeyaz | "ColourZone" detay haritaları renk bekliyor | `tints` |
| Model adı ile model uyuşmuyor | Farklı kaynaklar karıştırılmış | §2.1 |
| Göstergede canlı ekran yerine sabit doku | Ekran dörtgeni kavisli camın 1 cm arkasında | §5.3, kenarlardan ölç |
| Aynalar canlı görüntü göstermiyor | Elle konan ayna dörtgenleri gövdenin arkasında | Modelin ayna camı üçgenlerini ayır |
| LED'ler hiç görünmüyor | Tüp yolları göz kararı, geometrinin içinde | Modelin kendi şeritleri (`ambient_led`) |
| Direksiyondaki karbon/logo dönmüyor | Parçalar başka mesh'lerde | Disk içindeki parçaları direksiyona taşı (§5.2) |
| Logo camgöbeği yanıyor | Mavi çeyrekler LED şeridi sanıldı | Direksiyon parçalarını LED taramasından önce ayır |
| Klima düğmeleri / kapı kolu seçilemiyor | Atlasta birkaç piksel | §5.6b |
| Ayak boşluğu yolla aynı parlaklıkta | Gölge yok; zemin güneşi tam alıyor | Config `occlusion` (yüksekliğe göre karartma) |
