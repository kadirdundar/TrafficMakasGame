# Görevler

Sırayla yapılacak işler. Her satıra bir görev yaz; en üstteki ilk alınır.
Ayrıntı gerekiyorsa maddenin altına girintili notlar ekle.
Claude `/siradaki` ile ilk Todo maddesini alır, bitirince Done'a taşır.
Tümünü sırayla yaptırmak için `/loop /siradaki` kullan.

## Todo
-gazdan kesince her arabada çıkan ses her arabada çıkmasın sadece spor otomobillerde çıksın 
-araç renk seçim kısmı için rengi kişiler kendisi oluşturabilsin, metalik parlak vs gibi özellikleri de seçerek bir renk oluşturma aracı gibi özellikle birlikte
-Araçlar oyun açıldığında en kötü özellikliden en iyi özellikliye doğru sıralansın(yeni kullanıcılar için) eğer kullanıcı farklı bir şey satın aldıysa vs o seçili kalsın


## In progress

## Blocked

## Done
- [x] akıcı trafikde sol iki şerit biraz daha boş olsun (2026-11-21)
  - Sol iki şeride doğan araç payı yarıya indi, araçlar önleri boşken sağa geçiyor; sol iki şeritteki araç sayısı ~%20-50 azaldı (src/traffic.js)
- [x] arabaların fren kabileyeti daha iyi olsun (2026-11-21)
  - Tüm araçların taban freni 2,3 g → 2,75 g; 100→0 durma mesafesi ~%16 kısaldı, araç sıralaması aynı
- [x] gece yolun biraz daha net ve biraz daha aydınlık görünmesini istiyorum (2026-11-21)
  - Gece ayarında sis inceltildi, ortam ışığı ve lamba havuzları artırıldı (src/world.js)
