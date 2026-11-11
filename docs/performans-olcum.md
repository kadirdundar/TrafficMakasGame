# Performans ölçümleri

Gerçek telefonlarda alınan ölçümler. Her optimizasyondan önce ve sonra aynı protokolle ölçülür,
sonuç bu tabloya eklenir; böylece bir değişikliğin işe yarayıp yaramadığı sayılarla görülür.

## Nasıl ölçülür

1. Telefonu şarja **takmadan**, ölçümden önce birkaç dakika soğumaya bırak. Düşük güç modu kapalı.
2. Oyunu aç, ana ekranda **logoya (OTOBAN MAKAS 3D) art arda 5 kez dokun**. Sağ üstte
   "⏱ Ölçüm hazır" yazar. (Bilgisayarda adres sonuna `?perf` eklemek de aynı işi yapar.)
3. Standart senaryo: **Otoban · Gece · yoğun trafik · Audi A8**, çevrimdışı. Sürüşü başlat,
   ~200 km/s üstünde normal makas atarak sür. Duraklatılan süre sayılmaz.
4. 63 saniye sonra (ilk 3 sn ısınma, ayrıca raporlanır) oyun durur ve sonuç kartı açılır.
   **Kopyala**'ya bas ve satırı aşağıdaki "Ham sonuçlar" bölümüne cihaz modeliyle birlikte yapıştır.
5. Isınmayı görmek için aynı ölçümü arka arkaya 3 kez al (Tekrar ölç).

## Alanlar

| Alan | Anlamı |
| --- | --- |
| `fps.avg` / `fps.low1` | Ortalama FPS / en kötü %1'lik karelerin FPS'i (takılma hissi) |
| `fps.thirds` | İlk, orta, son 20 sn'nin FPS'i — düşüyorsa telefon ısınıp yavaşlıyor |
| `frameMs` | Kare süresi yüzdelikleri (16.7 ms = 60 FPS) |
| `workMs` | JS'in bir karede harcadığı süre (fizik + çizim komutları). Kare süresi yüksek ama bu düşükse darboğaz ekran kartı |
| `hitches` | 33/50/100 ms'yi aşan kare sayısı; `startMax` sürüşün ilk 3 sn'sindeki en uzun kare (shader derleme) |
| `pixelRatio` | Uyarlamalı çözünürlük: başlangıç, en düşük, son ve kaç kez düştüğü |
| `draws` / `tris` | Kare başına çizim çağrısı ve üçgen (ayna + ana görüntü birlikte) |
| `mem` | Bellekteki geometri, doku ve shader programı sayısı |

## Özet tablo

| Tarih | Cihaz | iOS | Build / commit | Ort FPS | %1 FPS | Kare p95 / maks (ms) | >100 ms takılma | Çizim ort / maks | Not |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-10-31 | iPhone (model yazılmadı) | ? | 602a431 + ölçüm paneli | 53.1 | ? | 25 / 40 | 0 | 280 / 304 | Elle aktarıldı, JSON yok |
| 2026-10-31 | Mac (M5), headless Chrome | — | 602a431 + ölçüm paneli | 59.5 | 56.8 | 17.4 / 204 | 4 | 281 / 305 | Önce. Takılmalar: ilk araç aynaya girince shader derleme |
| 2026-10-31 | Mac (M5), headless Chrome | — | shader ön derleme + trafik çizim azaltma | 60 | 57.1 | 17.1 / 17.7 | 0 | 228 / 255 | Sonra (2 tur, ikisi de aynı). JS iş süresi 1.9 → 1.4 ms |

### Bilgisayardaki ölçümden çıkanlar (2026-10-31)

- İşlemci yükü küçük: bir kare ~1.5 ms JS (yol bükülmesi 0.06 ms). Yolu shader'a taşımaya gerek yok.
- 200 ms'lik donmalar, arkadan gelen ilk trafik aracı dikiz aynasına girdiğinde boya ve plaka
  shader'larının aynaya özel (doğrusal çıkışlı, kabin ışığı olmayan) versiyonunun derlenmesinden.
  Çözüm: `warmShaders()` sürüş başında ekran ve ayna için her shader'ı önceden derliyor.
- Çizim çağrılarının ~%60'ı trafik araçlarıydı (araç başına 9-10). Far + stop tek mesh, ön + arka
  gece halesi tek mesh; plaka 70 m, jant/krom 140 m ötesinde çizilmiyor → araç başına 5-7.
- Kalan büyük kalem: yol kenarı segmentleri (~18 × 5 çizim) ve kokpit (~23).

## Ham sonuçlar

<!-- Her satır: cihaz modeli + commit + kopyalanan JSON -->
