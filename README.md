# 🛍️ E-Bebek Ürün Karuseli

Bu proje, [e-bebek.com](https://www.e-bebek.com) ana sayfasına entegre edilebilen, tamamen Vanilla JavaScript ile geliştirilmiş bir **dinamik ürün öneri karuselidir**. Ürünler bir Gist üzerinden çekilir veya `localStorage`’dan alınır, karusel kullanıcıya özel etkileşimlerle çalışır.

---

## 🔑 Özellikler

- 🔧 **Vanilla JavaScript** ile framework kullanmadan geliştirilmiştir
- 🌐 **Gist üzerinden ürün verisi çekme** veya cache üzerinden `localStorage` desteği
- 🎨 Tüm **CSS stilleri JS üzerinden dinamik olarak enjekte edilir**
- ❤️ Favorilere ekleme/çıkarma (kalp ikonu) ve `localStorage`’da saklama
- 🖱️ Sol/Sağ butonlar ile manuel kaydırma
- 🖐 Mouse ile **drag-to-scroll** desteği
- 📱 **Mobil uyumlu tasarım**, responsive kırılma noktaları ile optimize edilmiştir
- 🧩 **Modüler yapı**, tüm fonksiyonlar ayrı mantıksal bloklara ayrılmıştır
- 🔁 Scroll genişliği ve dinamik stage hesaplaması
- ✅ **Çalışma garantisi yalnızca ana sayfa (`/` veya `/index.html`) üzerinde verilir**

---


## 🧪 Kurulum ve Kullanım

1. **Repo’yu klonla**

```bash
git clone https://github.com/berkeberkay/ProductCarouselCase.git

https://www.e-bebek.com adresini aç

Sayfada herhangi bir yere sağ tıkla → Inspect / İncele seç

Üst menüden Console sekmesine geç

main.js dosyasındaki tüm JS kodunu kopyala ve yapıştır

Enter’a bas — karusel ana sayfada çalışmaya başlar 🎉



⚙️ Kullanılan Teknolojiler
✅ JavaScript (ES6+)

🧱 HTML DOM API

🎨 CSS (JS ile enjekte edilir)

💾 localStorage ile veri saklama

🌐 Fetch API ile ürün verisi alma

🧩 Teknik Detaylar
📱 Responsive Yapı
Mobil kırılma noktalarına (%80 genişlik, ok butonlarının daralması vb.) göre tüm layout yeniden biçimlenir.

❤️ Favori Yönetimi
Kalp ikonları 2 farklı SVG durumuna sahiptir. ebFavorites key’i ile localStorage’a ürün ID’leri yazılır.

🔁 Kaydırma Mantığı
Karusel kaydırması, .eb-carousel-stage elementinin transform: translateX(...) ile sola/sağa hareket ettirilmesiyle gerçekleştirilir.


