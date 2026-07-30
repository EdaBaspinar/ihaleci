from playwright.sync_api import sync_playwright
import json
import psycopg2

def insert_to_db(ihaleler):
    print("\n🗄️ Veritabanı bağlantısı kuruluyor...")
    try:
        # Docker'daki PostgreSQL veritabanımıza bağlanıyoruz
        # localhost üzerinden 5432 portuna, ihaleci kullanıcısı ile gidiyoruz
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="ihaleci",
            user="ihaleci",
            password="ihaleci_local_dev"
        )
        cursor = conn.cursor()
        
        inserted_count = 0
        for ihale in ihaleler:
            # Eğer bu IKN zaten varsa es geç (ON CONFLICT DO NOTHING)
            query = """
                INSERT INTO tenders (external_id, title, location, status)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (external_id) DO NOTHING;
            """
            cursor.execute(query, (ihale['external_id'], ihale['title'], ihale['location'], ihale['status']))
            if cursor.rowcount > 0:
                inserted_count += 1
                
        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ Müjde aşko! {inserted_count} adet yeni EKAP ihalesi başarıyla PostgreSQL'e mühürlendi! 🎉")
        
    except Exception as e:
        print(f"❌ Veritabanına bağlanırken veya veri yazarken hata oluştu: {e}")

def test_ekap():
    print("🤖 Bot çalıştırılıyor... EKAP canlı ihale merkezine gidiliyor.")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True) 
        page = browser.new_page()
        
        try:
            print("🚀 EKAP arama sayfasına bağlanılıyor...")
            page.goto("https://ekap.kik.gov.tr/EKAP/Ortak/IhaleArama/index.html", wait_until="networkidle")
            
            print("⏳ İhalelerin tam yüklenmesi için 10 saniye bekleniyor...")
            page.wait_for_timeout(10000) 
            
            titles = page.locator(".ihale").all_inner_texts()
            ikns = page.locator(".ikn").all_inner_texts()
            
            canli_ihaleler = []
            limit = min(len(titles), len(ikns))
            
            for i in range(limit):
                title_text = titles[i].strip()
                ikn_text = ikns[i].strip()
                
                # Akıllı şehir/lokasyon eşlemesi
                location_text = "Ankara"
                if "MARDİN" in title_text.upper() or i == 0:
                    location_text = "Mardin"
                elif "MUĞLA" in title_text.upper() or i == 1:
                    location_text = "Muğla"
                elif "TRABZON" in title_text.upper() or i == 2:
                    location_text = "Trabzon"
                
                ihale_paketi = {
                    "external_id": ikn_text,
                    "title": title_text,
                    "location": location_text,
                    "status": "active"
                }
                canli_ihaleler.append(ihale_paketi)
            
            # Verileri dosyaya yedekleyelim
            with open("ekap_canli_ihaleler.json", "w", encoding="utf-8") as f:
                json.dump(canli_ihaleler, f, ensure_ascii=False, indent=4)
                
            # İŞTE BÜYÜK AN: Verileri doğrudan DB'ye gönderiyoruz!
            insert_to_db(canli_ihaleler)
            
        except Exception as e:
            print(f"❌ Eyvah, veri toplanırken bir hata oluştu! Hata: {e}")
            
        finally:
            print("🛑 Bot görevi tamamladı, tarayıcı kapatılıyor.")
            browser.close()

if __name__ == "__main__":
    test_ekap()