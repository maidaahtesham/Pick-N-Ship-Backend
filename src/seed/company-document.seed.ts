import { company_document } from '../Models/company_document.entity';
import { DataSource } from 'typeorm';

export async function seedCompanyDocument (ds: DataSource) {
    const repo = ds.getRepository(company_document);
  const exists = await repo.findOne({ where: { company_id: 1 } });
  if (exists) {
    console.log("⚠️ Courier company  Document already exists, skipping...");
    return;
  }
    const documents = [
      {
        document_id: 1,
        company_id: 1,
        trade_license_document_path: '/uploads/documents/company1_trade_license.pdf',
        company_document_path: '/uploads/documents/company1_doc.pdf',
        establishment_card: '/uploads/documents/company1_establishment_card.pdf',
        trade_license_expiry_date: '2026-05-15',
        trade_license_number: 'TLN-123456',
        createdBy: 'system',
        updatedBy: 'system',
        is_active: true,
      },
          ];

    await repo.save(documents);
    console.log('✅ Company documents seeded successfully!');
  }
