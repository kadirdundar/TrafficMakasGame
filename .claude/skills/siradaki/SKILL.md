---
name: siradaki
description: TASKS.md'deki sıradaki görevi alır, uygular, doğrular, Done'a taşır ve commit atar. Kullanıcı "/siradaki", "sıradaki görevi yap", "listedeki işi al" dediğinde veya /loop ile görev listesini sırayla eritmek istediğinde kullan.
---

# Sıradaki görev

Görev listesi repo kökündeki `TASKS.md`. Bölümler: `## Todo`, `## In progress`,
`## Blocked`, `## Done`. Her görev bir `- [ ] ...` maddesi; altındaki girintili satırlar
o görevin notlarıdır ve maddeyle birlikte taşınır.

Argüman verildiyse (ör. `/siradaki gece farları`) Todo'da metni en iyi eşleşen maddeyi al;
verilmediyse Todo'daki **ilk** maddeyi al.

## Adımlar

1. **Önce yarım iş var mı bak.** `## In progress` boş değilse yeni görev alma; oradaki
   görevle devam et (önceki oturum yarıda kalmış olabilir, `git status` ve `git log` ile
   nerede kalındığını anla).
2. **Al.** Todo boşsa ve In progress de boşsa: "Todo listesi boş" de ve dur. `/loop` içinde
   çalışıyorsan döngüyü durdur (ScheduleWakeup `stop: true`). Değilse maddeyi notlarıyla
   birlikte Todo'dan kesip `## In progress` altına taşı.
3. **Anla.** Görev belirsizse ve makul bir varsayılan yoksa kullanıcıya tek soru sor.
   `/loop` içindeysen soru sormak yerine maddeyi `## Blocked` altına taşı, altına
   `  - Neden: ...` notu ekle, commit at ve bir sonraki göreve geç.
4. **Yap.** İlgili kodu oku, değişikliği yap. Görev bir araç ekleme/model çevirme ise
   `arac-ekle` skill'ini izle.
5. **Doğrula.** `npm run build` hatasız geçmeli. Oyunda görünen bir değişiklikse
   `.claude/launch.json` → `vite-dev` sunucusunu aç, konsol hatalarına bak ve ekran
   görüntüsüyle değişikliği gör. Doğrulanamıyorsa maddeyi Done'a çekme; Blocked'a nedeniyle taşı.
6. **Kapat.** Maddeyi `- [x]` yapıp `## Done` bölümünün **en üstüne** taşı, sonuna
   ` (YYYY-MM-DD)` tarihini ekle. Kısa bir not gerekiyorsa altına girintili yaz.
7. **Commit.** Kod değişikliği ve `TASKS.md` güncellemesi aynı commit'te olsun. Mesaj
   projenin stilinde: `feat(alan): ...` / `fix(alan): ...`, İngilizce, kısa. Push yapma.
8. **Rapor.** Ne yapıldığını, nasıl doğrulandığını ve Todo'da kaç görev kaldığını
   iki-üç cümleyle söyle.

## Kurallar

- Bir çağrıda yalnızca **bir** görev yap; birden fazla görevi tek commit'te birleştirme.
- Todo'daki sırayı değiştirme, görev metnini yeniden yazma (yalnızca taşı ve işaretle).
- Görevin kapsamı dışındaki fark ettiğin işleri yapma; Todo'nun **sonuna** yeni madde
  olarak ekle ve raporda belirt.
