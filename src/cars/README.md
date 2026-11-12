# Araçlar (`src/cars/`)

`src/cars/` altındaki **her klasör bir araçtır**. `src/cars/index.js`, içinde `car.js` olan
klasörleri kendisi bulur. Garaj düğmeleri, model künyesi, garajdaki model, online arkadaşların
arabaları ve 3D kokpit hep bu kayıttan okunur. Yeni araç için başka bir dosyaya dokunmak
gerekmez.

Modeli hazırlama (kaynak seçimi, temizlik, sıkıştırma, ölçüm) için:
[docs/3D-ARAC-MODELI-TARIFI.md](../../docs/3D-ARAC-MODELI-TARIFI.md).

## Yeni araç ekleme

Ham model `model-kaynak/` klasörüne konur (git'e girmez). Sonra:

```bash
npm run car:new -- <id> model-kaynak/<kaynak>.glb   # klasör + taslak car.js / convert.mjs
npm run car:inspect -- model-kaynak/<kaynak>.glb    # parça, malzeme ve üçgen listesi
npm run dev                                          # önizleme ve ölçüm sayfaları için
```

1. **Yön ve parçalar:** `/tools/model-preview/lab.html?car=<id>` açılır. Yeşil ok aracın
   burnunu göstermeli (göstermiyorsa `convert.mjs` → `transform.rotateY: 180`). "Kokpite al"
   aracıyla sürücü koltuğundan görünen parçalara tıklanır → `keepNodes`.
2. **Dış model:** `convert.mjs` → `exterior` (boya/cam/lamba adlandırmaları, iç mekânı
   `dropNodes` ile atma, `simplify.targetTris`). Sonra `npm run car:convert -- <id> --exterior-only`
   ve `/tools/model-preview/car.html?car=<id>&night=1&brake=1&high=1` ile kontrol.
3. **Kokpit ölçüleri:** ölçüm sayfasında "Direksiyon (3 nokta)", "Ayna camı", "Ambiyans şeridi"
   araçları `convert.mjs` → `cockpit` satırlarını üretir. `npm run car:convert -- <id>`.
4. **Kokpit görünümü:** `/tools/model-preview/lab.html?car=<id>&model=cockpit` üzerinde
   "Gösterge (4 köşe)", "Bulanık detay", "Metal parça" → `car.js` → `cockpit`. Kontrol:
   `/tools/model-preview/cockpit.html?car=<id>&preset=0|1|2` (gece için `&night=1`).
5. Hazır olunca `car.js`'teki `draft: true` satırı silinir; araç garajda görünür.

Ayrıntılar, bütçe ve bilinen tuzaklar: [docs/3D-ARAC-MODELI-TARIFI.md](../../docs/3D-ARAC-MODELI-TARIFI.md).
Claude Code içinde `/arac-ekle` komutu bu adımları sırayla yürütür.

## `car.js` alanları

| Alan | Anlamı |
| --- | --- |
| `id` | Kısa ve benzersiz ad (klasör adıyla aynı). localStorage'a ve online mesajlara bu yazılır. |
| `draft` | `true` iken garajda görünmez; önizleme sayfaları yine açar. |
| `order` | Garajdaki sıra. İlk araç varsayılandır. |
| `label` | Garaj düğmesindeki yazı. |
| `make`, `model`, `variant` | Garajdaki başlık (ör. `BMW` / `M4 CS` / `G82 · VR46 Edition`). |
| `aliases` | Eski veya gevşek adlar (ör. `['bmw']`). Eski sürümden gelen kayıtları bu araca yönlendirir. |
| `price` | Yeni sürümde garaj fiyatı (para). `0` = başlangıç aracı, herkeste vardır. Yazılmazsa `DEFAULT_CAR_PRICE` (`src/progression/config.js`). |
| `performance` | Yeni sürümde aracın değerleri (aşağıda). Yazılmazsa klasik oyunun değerleri. |
| `drivetrain` | Şanzıman, motor ve kabin sesi (aşağıda). Yazılmazsa Audi A8'inki. |
| `chassis` | Çekiş tipi, kütle ve gövde davranışı (aşağıda). Yazılmazsa Audi A8'inki. |
| `credit` | Model künyesi: `title`, `url`, `author`, `license`, `licenseUrl`, `note`. CC BY modellerde zorunludur. |
| `exterior` | Dış model (aşağıda). |
| `cockpit` | Kokpit (aşağıda). |

### `performance` (yeni sürüm)

Klasik oyunda (garajdaki "Yeni Sürüm" anahtarı kapalıyken) bu alan okunmaz; her araç aynı
fiziği kullanır. Açıkken aracın fiziği bu değerlerden ve alınan yükseltmelerden hesaplanır
(`src/progression/performance.js`). Çarpanlar klasik araca göredir (`1` = bugünkü oyun).

| Alan | Anlamı |
| --- | --- |
| `topSpeed` | Son hız (km/s). Hava direnci buna göre çözülür; son 25 km/s klasik oyundaki gibi yavaş tırmanılır. |
| `power` | Motor gücü: 100 km/s üstü çekiş (100→200). |
| `traction` | Kalkış çekişi: 0-100. Dört çeker / arkadan motorlu araçlarda yüksek. |
| `handling` | Manevra: direksiyona yanal tepki ve lastiklerin bunu alma hızı. |
| `braking` | Fren gücü. |
| `upgradeCost` | Yükseltme fiyat çarpanı (pahalı araçta yükseltme de pahalı). |

Mevcut araçlar: A8 (başlangıç, 250 km/s, 0-100 3,9 sn), M4 CS (15.000), G 700 (18.000, hızlı
kalkış ama hantal), AMG GT (22.000), 911 (30.000, en iyi manevra). Giriş seviyesi: Passat B5 (3.000,
200 km/s), Corolla (5.000, 200 km/s), Focus (5.000, 205 km/s), Passat B8 (8.000, 220 km/s), C 200 (12.000, 246 km/s). Yükseltmeler, spoylerler, jant renkleri,
kazanç ve fiyat basamakları `src/progression/config.js` içinde.

Fren: `braking: 1` kuru yolda 1,15 g'dir (hava direnci buna eklenir, yani araç yüksek hızdan
daha sert yavaşlar). Yağmurda fren tutuşu %80'e iner, pistte lastikler 1,6 g tutar. Tam frende
ABS devreye girer (hafif titreşim) ve direksiyon etkisi yarıya iner.

### `drivetrain` ve `chassis`

Aracın nasıl vites attığını, nasıl ses verdiğini ve gövdesinin nasıl davrandığını belirler
(`src/progression/drivetrain.js`; varsayılanlar orada). Hız ve ivme `performance`'tan gelir;
vites oranları devir göstergesini ve motor sesini sürer, ivmeyi değiştirmez.

| Alan | Anlamı |
| --- | --- |
| `drivetrain.gears` | Vites oranları, birinciden başlayarak. Uzunluğu vites sayısıdır. |
| `drivetrain.finalDrive`, `wheelCircumference` | Diferansiyel oranı ve çeken tekerleğin yuvarlanma çevresi (m). Üçü birlikte her viteste hız başına devri verir; en üst viteste son hızda (yükseltmelerle +30 km/s) devir `redline`'ı geçmemeli. |
| `drivetrain.idleRpm`, `redline` | Rölanti ve devir sınırı. Tam gazda vites sınırın %93'ünde atılır; gösterge sınırın 250 d/d altında kırmızıya döner. |
| `drivetrain.cruiseShiftRpm` | Gaz bırakılmışken vites büyütme devri (sakin seyir). |
| `drivetrain.shiftSec` | Vites değişim süresi: çift kavrama ~0.25, tork konvertörlü ~0.4, düz vites ≥ 0.5 (motor sesi debriyajda belirgin düşer). |
| `drivetrain.cylinders` | Silindir sayısı: ateşleme frekansını, yani sesin perdesini belirler. |
| `drivetrain.insulation` | Kabin yalıtımı: 1 çift camlı limuzin (A8), 0'a doğru egzoz sesi içeri girer (spor araç ~0.35-0.45, eski sedan ~0.5-0.6). |
| `drivetrain.turbo` | Turbo sesinin gücü; atmosferik motorda 0. |
| `chassis.layout` | `'fwd'`, `'rwd'` ya da `'awd'`. Önden çekiş tam gazda (≈130 km/s altı) dışa açar, arkadan itiş burnu içeri çevirir; dört çeker yağmurda kalkış çekişini en az kaybeder. |
| `chassis.mass` | Kütle (kg): çarpışmada ne kadar savrulduğunu ve ne kadar hız kaybettiğini belirler (trafik kütleleri `drivetrain.js` → `TRAFFIC_MASS`). |
| `chassis.roll`, `chassis.pitch` | Virajda yatma ve gaz/frende dalma, A8'e göre çarpan (G 700 1.9 / 1.6, 911 0.5 / 0.55). Büyük değer aynı zamanda daha yavaş oturan bir gövde demektir. |

### `exterior`

| Alan | Anlamı |
| --- | --- |
| `url` | GLB yolu (`${import.meta.env.BASE_URL}models/...`). |
| `length` | Gerçek araç boyu (m). Model bu boya ölçeklenir, tekerlekler y = 0'a oturur. |
| `paintMaterial` | Oyuncu rengiyle boyanan malzemenin adı (varsayılan `paint`). |
| `metalness`, `roughness`, `clearcoat`, `clearcoatRoughness`, `envMapIntensity` | İsteğe bağlı. Fabrika boyası; yazılmazsa düz renk üstüne parlak vernik (0.15 / 0.48 / 0.8 / 0.1 / 0.8). Garajdaki metalik, mat ve sedef kaplamalar bunun üstüne uygulanır (`src/cars/finish.js`). Mat fabrika boyası isteyen araç (G 700) değerleri kendisi yazar. |
| `keepFinish` | İsteğe bağlı. Yükleyici boya dışındaki malzemeleri adına göre sınırlar (`src/cars/loadExterior.js` → `SURFACE_FINISH`): `glass`/`lens` ve `chrome`/`mirror` parlak kalır, `rim`/`wheel`/`silver` ve `gloss`/`shiny` yarı parlak, adı tanınmayan her şey mat plastik sayılır (metalness ≤ 0.3, roughness ≥ 0.62; kaynak modellerde plastikler çoğu zaman ayna krom gibi gelir). Burada adı geçen malzemeler (ör. `['chrome', 'trim', 'rim', 'glass']`) `convert.mjs` → `materials` değerlerini aynen korur. Yansıma gücü `keepFinishEnv` (varsayılan 0.6). |
| `head`, `tail` | Far/stop parlaklıkları: `{ day, night, highBeam }`, `{ day, night, brake }`. |
| `lamps` | Malzeme adına göre lamba kuralları; ilk eşleşen kazanır. `match` (RegExp), `role` (`head`/`tail`), isteğe bağlı `emissive`, `color`, `removeMap`, `emissiveFromMap`, `intensity`, `box` (halenin konumu bu lambaların sınır kutusundan alınır). |
| `spoiler` | İsteğe bağlı. Spoyler yeri modelden kendiliğinden ölçülür (bagaj kapağının ya da SUV'da tavanın arka kenarı, `src/cars/spoiler.js`). Yanlış yere oturursa `{ z, y, width }` (model metresi) ile elle verilir. Kontrol: `/tools/model-preview/car.html?car=<id>&spoiler=wing&az=0.8&pol=1.25&dist=5&t=0,0.9,1.4` (`lip`, `ducktail`, `wing`). |
| `rims` | İsteğe bağlı. Jant boyama (`src/cars/rims.js`): `materials` jant malzemeleri (varsayılan adında `rim`/`wheel` geçenler), `tyres` lastik malzemeleri (tekerlek yerini bulmak için), `reach` jantın tekerlek yarıçapındaki payı (varsayılan 0.9; lastikle aynı malzemedeyse ~0.72), `outer` (m) sadece dış yüzü boyar (kaliperle aynı malzemedeki kollar için). Boyanan bu parçalar araç giderken döner (drone tekrarı, online arkadaşlar); `spin: false` döndürmez. Kontrol: `car.html?car=<id>&rim=0xc9a227`, dönüş için `&spin=0.003` (kare başına metre). |
| `plate` | İsteğe bağlı. Plaka yeri (`src/cars/plate.js`): `{ front: { y }, rear: { y } }` plakanın yerden yüksekliği (m, varsayılan ön 0.36 / arka 0.55); derinlik tampondan kendiliğinden ölçülür. `front: false` ön plakasız araç. Modelin kendi plakası varsa `{ replace: '<malzeme>' }`: o gizlenir, oyuncunun plakası aynı yere ve eğime oturur. Kontrol: `car.html?car=<id>&plate=34 ABC 123&az=0&pol=1.45&dist=4.5`. |
| `carbon` | İsteğe bağlı. Karbon kaput ve ayna kapağı (`src/cars/carbon.js`) modelden kendiliğinden bulunur: kaput ön camın önündeki yukarı bakan boya (kendi parçasıysa tamamı), ayna kapakları yanlarda ayna yerindeki küçük parçalar. Yanlış çıkarsa `{ hood: { rearZ, halfWidth, minY, materials } \| false, mirrors: false }`: `materials` kendi malzemesi olan kaput (M4). Kontrol: `car.html?car=<id>&carbon=hood,mirrors&az=-2.6&pol=0.9&dist=6`. |
| `tint` | İsteğe bağlı. Cam filmi (`src/cars/tint.js`): varsayılan adında `glass`/`window` geçen malzemeler; farklıysa `{ materials: [...] }`. Kontrol: `car.html?car=<id>&tint=0.85`. |
| `glow` | Haleler: `front`, `flare`, `rear`. Her biri `color`, `opacity`, `size: [w, h]`, `offset` (lambanın önüne/arkasına mesafe), ve ya `from: 'head'/'tail'` + `inset` (dış kenardan içeri) ya da modelden ölçülmüş `at: [x, y, z]`. |

### `cockpit`

| Alan | Anlamı |
| --- | --- |
| `modelUrl`, `scale` | Kokpit GLB'si ve ölçeği. |
| `cluster` | Gösterge çizimi: `'bmw'` ya da iki kadranlı çizim; kadranlar arasındaki marka `'audi'` (halkalar), `'vw'` (amblem), `'mercedes'` (AMG), `'brabus'`, `'porsche'`, `'toyota'`, `'ford'` (`src/cockpit.js` → `CLUSTER_LETTERING`, `paint3DScreen`). |
| `defaultEye` | Sürücü gözünün model içindeki konumu (GLB'de `eye` extras'ı varsa o kullanılır). |
| `wheelRadius`, `steerSign` | Direksiyon çemberi (dokunmatik direksiyon için) ve dönüş yönü. |
| `softMaterials`, `tints` | Deri/döşeme malzemeleri (mat yapılır) ve isteğe bağlı koyulaştırma (`{ ad: 0.4 }`). |
| `paintMaterials` | Ön camdan görünen kaput gibi koyu metalik boyanacak malzemeler. |
| `screens.cluster` | Canlı gösterge camının köşeleri `tl/tr/bl/br`, normali `n`, `logical` boyut ve `px` çözünürlük. |
| `ledPaths` | Ambiyans LED tüplerinin yolları. Model kendi şeritlerini (`ambient_led`) getiriyorsa `[]`. |
| `glassOut`, `glassUp`, `wiperPivots`, `wiperLen` | Silecekler. |
| `floor` | Zemini olmayan modeller için ayak boşluğu düzlemi, yoksa `null`. |
| `cabinNightGlow` | Gece kabin parıltısı (varsayılan 0.22). |
| `occlusion` | Yüksekliğe göre karartma `{ y0, y1, min }`. |
| `atlasPatches`, `satinPieces` | Okunamayan küçük detayların keskin yeniden çizimi ve metal parçalar (`src/cockpitDecals.js`). Markaya özel çizimler aracın klasöründe durur (ör. `m4/painters.js`). |

Değerleri tahmin etme; modelden ölç (tarif §5–§6).

## Trafikteki araç modelleri

Trafikteki sedanlar ve spor araçların bir kısmı garaj modellerinin hafif kopyalarıdır
(`public/models/traffic/<id>.glb`, ~11.500 üçgen). `tools/convert-traffic.mjs` garaj modelini
(`public/models/<id>.glb`) okur ve oyunun çizdiği altı parçaya ayırır: `body` (boya; trafik her
araca kendi rengini verir), `glass` (koyu cam), `trim` (mat her şey, lastikler dahil), `rim`
(metal her şey: jant, krom, ayna camı), `head` ve `tail` (lambalar). Dışarıdan görünmeyen
yüzeyler (kabin, motor bölmesi), far camları, amblem ve modelin kendi plakası atılır; tekerlek,
lamba ve plaka yerleri ölçülüp dosyaya yazılır. Oyunda bu araçlar çizim araçlarla aynı kodla ve
aynı sayıda çizim çağrısıyla çizilir (`src/vehicleModels.js` → `createModelGeometry`).

```bash
npm run car:traffic              # tools/convert-traffic.mjs → CARS içindeki bütün araçlar
npm run car:traffic -- corolla   # tek araç (araç başına birkaç dakika: görünürlük ışınları)
```

- Yeni bir aracı trafiğe eklemek: `tools/convert-traffic.mjs` → `CARS` (kaynak, `length`, plaka
  yüksekliği, gerekiyorsa malzeme kuralları) ve `src/trafficModels.js` → `MODELS_BY_TYPE`
  (hangi araç tipinin hangi sırasında çıkacağı; `null` çizim araçta bırakır).
- Garaj modeli yeniden çevrildiyse (`car:convert`) trafik kopyası da yeniden üretilmelidir.
- Kontrol: `/tools/model-preview/traffic.html?cars=corolla,sedan&night=1&brake=1&blink=1&spin=1`
  (model adları ve `sedan`, `suv`, `van`... çizim tipleri yan yana).
- Araç tipinin çarpışma kutusu değişmez (`src/traffic.js` → `VEHICLE_TYPES`); model gerçek boyuyla
  çizilir, aradaki fark birkaç santimdir.

## `convert.mjs` alanları

`npm run car:convert -- <id> [--cockpit-only | --exterior-only] [--out <klasör>]` bu dosyayı okur.
Düğüm adları `npm run car:inspect` çıktısındaki adlardır; desenler RegExp veya tam ad olabilir.

| Alan | Anlamı |
| --- | --- |
| `source` | Ham model (`model-kaynak/...glb`). |
| `transform` | `rotateY` (derece; burun -Z'ye bakmalı) ve `scale` ya da `length` (m, ölçeği boydan hesaplar). |
| `dropNodes` | İki çıktıdan da atılacak düğümler (ör. Sketchfab arka plan düzlemleri `/^Plane\./`). |
| `exterior.out` | Çıktı (`public/models/<id>.glb`). |
| `exterior.renameMaterials` | `[desen, yeniAd]` listesi: `paint`, `glass`, `headLight…`, `tailLight…` (car.js → `lamps` bu adlara bakar). |
| `exterior.dropNodes` | Sadece dış modelden atılacaklar (iç mekân, motor). |
| `*.simplify` | `{ targetTris, maxError }`: her parçada aynı mutlak hata (metre); hedefe inen en küçük hata aranır, `maxError` sınırdır. Eski kip: `{ ratio, error }` (parça başına göreli). |
| `*.mergeMaterials` | `[desen, hedefAd]`: benzer görünen malzemeleri tek malzemeye toplar (draw call düşer). |
| `*.materials` | `[desen, { color, alpha, metallic, roughness }]`: PBR düzeltmeleri, ilk eşleşen (renk doğrusal RGB). |
| `*.cleanAttributes` | Dokusuz malzemelerden UV/tangent/renk verisini siler (dosya küçülür, birleştirme artar). |
| `*.maxTextureSize`, `*.webpQuality` | Doku boyu sınırı ve WebP kalitesi. |
| `*.textureSizes` | `[desen, px, kanallar?]`: eşleşen malzemelerin dokularına ayrı sınır (`kanallar` ile sadece ör. `['metallicRoughness', 'occlusion', 'normal']`) (ör. panel boyunca tekrar eden kumaş/plastik doku ve normal haritaları için 256). Kokpit dosyasını en çok bunlar büyütür. |
| `*.ao` | `{ rays, distance, strength, min, skip }`: önceden hesaplanmış ortam gölgesi (`tools/lib/ambient-occlusion.mjs`), köşe rengi (COLOR_0) olarak saklanır; oyunda ek maliyeti yok. `distance` ışın boyu (m): dışta ~0.3, kabinde ~0.12. |
| `*.compress` | meshopt geometri sıkıştırması (oyun çözer; dosya ~2-3 kat küçülür). |
| `cockpit.out`, `cockpit.keepNodes` | Kokpit çıktısı ve sürücüden görünen düğümler (boşsa kokpit atlanır). |
| `cockpit.eye` | Göz noktası (sahne extras'ına yazılır). |
| `cockpit.steering` | `{ node, pivot, axis, radius, columnBeyondZ }`: direksiyonu dönen çember ve sabit kolon olarak ayırır (kolon = `columnBeyondZ`'den öne uzanan parçalar). |
| `cockpit.wheelTrim` | `{ from, radius, axial }`: başka düğümlerde olup direksiyon diskinin tamamen içinde kalan parçaları (krom/karbon kollar, logo, düğmeler, vites pedalları) direksiyona taşır. `from: '*'` tüm `keepNodes`'u tarar (önerilen; elle liste parça kaçırır). Kontrol: `cockpit.html?car=<id>&steer=1.6`. |
| `cockpit.mirrors` | `{ name: 'mirror_left' / 'mirror_right' / 'mirror_center', from, uv?, x?, y?, z?, facing? }`: modelin ayna camı üçgenleri; UV kutusu ve/veya üçgen merkezinin konum aralığı ve yönü ile seçilir. |
| `cockpit.join`, `cockpit.keepSeparate` | Statik parçaları malzemeye göre birleştirir; oyunun adla aradığı düğümler (direksiyon, aynalar, LED, zemin) ve `keepSeparate` ayrı kalır (`atlasPatches`/`satinPieces` düğümlerini buraya yaz). |
| `cockpit.ambientLed` | `{ from, minBlue, overRed, overGreen }`: atlasta mavi boyalı şeritleri `ambient_led` mesh'ine ayırır. |
| `cockpit.detail` | `[{ materials, from, strength, repeat }]`: deri/plastik yüzey dokusu (normal haritası, `tools/lib/surface-detail.mjs`). `from: 'base'` malzemenin kendi dokusunu yükseklik haritası sayar; `'leather'` / `'plastic'` döşenebilir prosedürel doku, UV'si olmayan parçalara kutu izdüşümlü UV (`repeat`: metre başına tekrar). |
| `cockpit.floor` | `{ y, x: [x0, x1], z: [z0, z1], color }`: zemini olmayan modellere ayak boşluğu düzlemi. |


