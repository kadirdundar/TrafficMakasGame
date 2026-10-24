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
| `credit` | Model künyesi: `title`, `url`, `author`, `license`, `licenseUrl`, `note`. CC BY modellerde zorunludur. |
| `exterior` | Dış model (aşağıda). |
| `cockpit` | Kokpit (aşağıda). |

### `exterior`

| Alan | Anlamı |
| --- | --- |
| `url` | GLB yolu (`${import.meta.env.BASE_URL}models/...`). |
| `length` | Gerçek araç boyu (m). Model bu boya ölçeklenir, tekerlekler y = 0'a oturur. |
| `paintMaterial` | Oyuncu rengiyle boyanan malzemenin adı (varsayılan `paint`). |
| `envMapIntensity` | Boya yansıma gücü (varsayılan 1.2). |
| `head`, `tail` | Far/stop parlaklıkları: `{ day, night, highBeam }`, `{ day, night, brake }`. |
| `lamps` | Malzeme adına göre lamba kuralları; ilk eşleşen kazanır. `match` (RegExp), `role` (`head`/`tail`), isteğe bağlı `emissive`, `color`, `removeMap`, `emissiveFromMap`, `intensity`, `box` (halenin konumu bu lambaların sınır kutusundan alınır). |
| `glow` | Haleler: `front`, `flare`, `rear`. Her biri `color`, `opacity`, `size: [w, h]`, `offset` (lambanın önüne/arkasına mesafe), ve ya `from: 'head'/'tail'` + `inset` (dış kenardan içeri) ya da modelden ölçülmüş `at: [x, y, z]`. |

### `cockpit`

| Alan | Anlamı |
| --- | --- |
| `modelUrl`, `scale` | Kokpit GLB'si ve ölçeği. |
| `cluster` | Gösterge çizimi: `'audi'` veya `'bmw'` (`src/cockpit.js` → `paint3DScreen`). |
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
| `*.simplify` | `{ targetTris, error }` ya da `{ ratio, error }`. `error` büyüdükçe daha çok sadeleşir. |
| `*.maxTextureSize`, `*.webpQuality` | Doku boyu sınırı ve WebP kalitesi. |
| `*.compress` | meshopt geometri sıkıştırması (oyun çözer; dosya ~2-3 kat küçülür). |
| `cockpit.out`, `cockpit.keepNodes` | Kokpit çıktısı ve sürücüden görünen düğümler (boşsa kokpit atlanır). |
| `cockpit.eye` | Göz noktası (sahne extras'ına yazılır). |
| `cockpit.steering` | `{ node, pivot, axis, radius, columnBeyondZ }`: direksiyonu dönen çember ve sabit kolon olarak ayırır (kolon = `columnBeyondZ`'den öne uzanan parçalar). |
| `cockpit.wheelTrim` | `{ from, radius, axial }`: başka düğümlerde olup direksiyon diskinin içinde kalan parçaları (karbon kollar, logo, pedallar) direksiyona taşır. |
| `cockpit.mirrors` | `{ name: 'mirror_left' / 'mirror_right' / 'mirror_center', from, uv }`: modelin ayna camı üçgenleri (UV kutusuyla). |
| `cockpit.ambientLed` | `{ from, minBlue, overRed, overGreen }`: atlasta mavi boyalı şeritleri `ambient_led` mesh'ine ayırır. |
| `cockpit.floor` | `{ y, x: [x0, x1], z: [z0, z1], color }`: zemini olmayan modellere ayak boşluğu düzlemi. |
| `cockpit.materials` | `[desen, { metallic, roughness }]`: PBR düzeltmeleri (ilk eşleşen). |

