---
name: arac-ekle
description: Otoban Makas'a yeni bir araç ekler veya mevcut bir aracın modelini yeniden çevirir (ham GLB → src/cars/<id>/ + public/models/). Kullanıcı yeni araba/model eklemek, bir GLB'yi oyuna çevirmek, aracın kokpitini veya dış modelini standartlaştırmak istediğinde kullan.
---

# Yeni araç ekleme

Kaynaklar (önce oku): `src/cars/README.md` (alanlar ve adımlar) ve
`docs/3D-ARAC-MODELI-TARIFI.md` (bütçe, ergonomi kuralları, bilinen tuzaklar).
Referans araçlar: `src/cars/a8/` (sade), `src/cars/m4/` (her özellik: direksiyon parçaları,
ayna camları, LED şeritleri, yeniden çizilen detaylar).

Değerleri asla tahmin etme; ölç. Her adımdan sonra ekran görüntüsüyle doğrula.

## Adımlar

1. **Kaynak:** Kullanıcıdan ham GLB'yi `model-kaynak/` altına koymasını iste (git'e girmez).
   `npm run car:inspect -- model-kaynak/<x>.glb` ile lisans, boyut, yön ve parça listesine bak.
   Lisans CC BY ise künye zorunlu; lisans yoksa kullanıcıya sor.
2. **İskelet:** `npm run car:new -- <id> model-kaynak/<x>.glb` → `src/cars/<id>/car.js` ve
   `convert.mjs` (taslak, garajda görünmez).
3. **Yön ve parçalar:** geliştirme sunucusunu aç (`.claude/launch.json` → `vite-dev`),
   `/tools/model-preview/lab.html?car=<id>`. Yeşil ok burnu göstermiyorsa `transform.rotateY`.
   Sayfadaki `window.__lab.onPick(hit)` ile programatik ölçüm yapılabilir (raycast + onPick).
4. **Dış model:** `convert.mjs` → `exterior`: malzeme adlandırmaları (`paint`, `glass`,
   `headLight…`, `tailLight…`), iç mekânı `dropNodes` ile at, `simplify.targetTris: 60000`,
   `maxTextureSize: 1024`, `compress: true`. `npm run car:convert -- <id> --exterior-only`.
   Hedef: ≤ 60k üçgen, ~1 MB. Kontrol: `car.html?car=<id>` (¾ ön/arka, gece, fren, uzun far).
   Lamba malzemesi yoksa `car.js` → `exterior.glow.*.at` ile ölçülmüş nokta ver.
5. **Kokpit modeli:** önce "Direksiyon (3 nokta)" ile göz noktasını bul, sonra
   "Gözden görünen parçalar" düğmesi `keepNodes` listesini çıkarır (tek tek: "Kokpite al"); "Direksiyon (3 nokta)" →
   `steering`, `eye`, `wheelTrim`; "Ayna camı" → `mirrors`; "Ambiyans şeridi" → `ambientLed`.
   Ön camı `keepNodes`'a alma. `join: true`, `simplify: { targetTris: 65000 }`.
   `npm run car:convert -- <id>`. Hedef ≤ 65k üçgen, ≤ 30 draw call (cockpit.html'de say).
   Kaynak "siyah" malzemeler çoğu zaman gri ve çok metaliktir: `materials` ile koyulaştır.
6. **Kokpit ayarı:** `lab.html?car=<id>&model=cockpit` → "Gösterge (4 köşe)" → `car.js` →
   `cockpit.screens.cluster` (kavisli camda kenarlardan ölç; dörtgen camın önünde olmalı);
   bulanık detaylar için "Bulanık detay" → `atlasPatches` (çizim fonksiyonu aracın klasörüne);
   kapı kolu gibi parçalar için "Metal parça" → `satinPieces`. `car.js`'teki yorumlu `cockpit`
   bloğunu doldur; `cluster: 'audi' | 'mercedes' | 'bmw'`.
7. **Doğrulama:** `cockpit.html?car=<id>&preset=0|1|2`, `&night=1`, `&steer=0.8`, dikey ekran
   (`&w=420&h=740`). Direksiyon dönüşünde tüm direksiyon parçaları dönmeli; aynalar canlı,
   gösterge canlı olmalı. Test: `steering_wheel` düğümünü gizleyip render al; direksiyon
   bölgesinde sadece kolon kılıfı kalmalı. Sonra oyunda garajdan aracı seçip sürüşe başla.
8. **Bitiş:** `draft: true` satırını sil, `npm run build`. Commit/push için kullanıcıya sor.
