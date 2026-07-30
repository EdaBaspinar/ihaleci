import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    await pool.query(`DROP TABLE IF EXISTS tenders CASCADE;`);

    await pool.query(`
      CREATE TABLE tenders (
        id SERIAL PRIMARY KEY,
        external_id TEXT UNIQUE,
        title TEXT,
        agency TEXT,
        location TEXT,
        city TEXT,
        tender_date TIMESTAMP,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const mockTenders = [
      {
        external_id: '2026-YBS-901',
        title: 'Üniversite Rektörlüğü Yapay Zeka Tabanlı Akıllı Otomasyon ve Veri Analitiği Yazılımı Hizmet Alımı',
        agency: 'Üniversite İdari ve Mali İşler Daire Başkanlığı',
        location: 'Merkez',
        city: 'Aksaray',
        tender_date: '2026-06-15',
        description: 'Kampüs yerleşkesindeki tüm idari süreçlerin optimize edilmesi amacıyla; siber güvenlik standartlarına tam uyumlu, büyük veri analitiği yapabilen ve yapay zeka destekli yeni nesil otomasyon sistemi yazılımı tedarik ve entegrasyon işidir.',
        status: 'active'
      },
      {
        external_id: '2026-CYBER-882',
        title: 'Kamu Ağ Altyapıları İçin Merkezi Siber Güvenlik Duvarı (Firewall) ve Tehdit Avcılığı Yazılımı Lisans Alımı',
        agency: 'Bilgi Teknolojileri ve İletişim Kurumu',
        location: 'Ankara',
        city: 'Ankara',
        tender_date: '2026-07-01',
        description: 'Kritik kamu kurumlarının ağ altyapılarının siber saldırılara karşı korunması amacıyla, siber güvenlik yazılımlarının güncellenmesi, tehdit algılama sistemlerinin kurulması ve 1 yıl süreli lisanslama işidir.',
        status: 'active'
      },
      {
        external_id: '2026-KMR-403',
        title: 'Belediye Kent Güvenlik Yönetim Sistemi Fiziksel Kamera Alımı İşi',
        agency: 'Belediye Başkanlığı',
        location: 'Merkez',
        city: 'Karaman',
        tender_date: '2026-06-20',
        description: 'Meydan ve caddelere yerleştirilmek üzere sadece yüksek çözünürlüklü, gece görüşlü kent güvenlik kameralarının ve bağlantı aparatlarının fiziksel olarak tedarik edilmesi işidir.',
        status: 'active'
      },
      {
        external_id: '2026-INS-204',
        title: 'Merkez Kampüs Kütüphane Binası Ek Depo İnşaatı ve Çevre Kaldırım Taşları Yapım İşi',
        agency: 'Üniversite Yapı İşleri Daire Başkanlığı',
        location: 'Kampüs',
        city: 'Aksaray',
        tender_date: '2026-08-10',
        description: 'Kütüphane binasının arkasına yapılacak olan betonarme ek depo binası inşaatı, dış cephe yalıtım işleri ve çevre kaldırım taşlarının yenilenmesi işidir.',
        status: 'active'
      }
    ];

    for (const tender of mockTenders) {
      await pool.query(`
        INSERT INTO tenders (external_id, title, agency, location, city, tender_date, description, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        tender.external_id,
        tender.title,
        tender.agency,
        tender.location,
        tender.city,
        tender.tender_date,
        tender.description,
        tender.status
      ]);
    }

    return NextResponse.json({ success: true, message: "Eski tablo silindi, veritabani taze ihalelerle guncellendi!" }, { status: 200 });

  } catch (error: any) {
    console.error("GUNCELLEME HATASI:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}