# TenderIQ PRO - Otomatik İhale Ajanı 🚀

TenderIQ PRO, ihale süreçlerini otomatize etmek, hızlandırmak ve akıllı veri analizi sağlamak amacıyla geliştirilmiş AI (Yapay Zeka) destekli tam yığın (full-stack) bir web uygulamasıdır. 

## 🌟 Öne Çıkan Özellikler
* **Yapay Zeka Destekli Analiz:** İhale metinlerini ve süreçlerini analiz eden entegre AI sohbet (chat) asistanı.
* **Gelişmiş Dashboard:** İhale verilerinin, durumlarının ve istatistiklerinin anlık olarak takip edilebildiği kullanıcı dostu arayüz.
* **Otomasyon:** İhale verilerinin toplanması ve işlenmesi süreçlerinde yüksek verimlilik.
* **Konteyner Mimarisi:** Docker kullanılarak sistemin her ortamda sorunsuz ve izole çalışması.

## 💻 Kullanılan Teknolojiler
* **Frontend & Backend:** Next.js
* **Veritabanı:** PostgreSQL
* **Konteynerizasyon & Dağıtım:** Docker & Docker Compose
* **Yapay Zeka Entegrasyonu:** AI Agent & API Routes

## 🛠️ Kurulum ve Çalıştırma

Projeyi kendi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/EdaBaspinar/ihaleci.git
   cd ihaleci-ekap-dev

```

2. **Docker ile Başlatma:**
Proje `docker-compose` ile yapılandırılmıştır. Veritabanı ve uygulamanın ayağa kalkması için terminalde şu komutu çalıştırın:
```bash
docker-compose up -d

```


3. **Gerekli Paketlerin Yüklenmesi (Eğer Node.js ile çalıştırılacaksa):**
```bash
npm install

```


4. **Uygulamayı Başlatma:**
```bash
npm run dev

```


*Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.*

## 📈 Proje Amacı ve Çıktılar

Bu proje, veri analitiği ve yazılım geliştirme prensiplerini bir araya getirerek, karmaşık ihale verilerinden stratejik değer üretmeyi hedefler. Geliştirilen AI ajanı sayesinde manuel inceleme süreleri minimuma indirilmiştir.
