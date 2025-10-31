import { db } from '../db';
import {
  masterVehicles,
  masterAfdelings,
  masterPks,
  masterEmployeeDepartments,
  masterEmployeePositions,
  masterEmployeeGroups,
  masterDebtTypes,
  masterBkkExpenseCategories,
} from '../db/schema/master';

const seedData = {
  vehicles: [
    'BK 1234 AB', 'BK 2345 CD', 'BK 3456 EF', 'BK 4567 GH', 'BK 5678 IJ',
    'BK 6789 KL', 'BK 7890 MN', 'BK 8901 OP', 'BK 9012 QR', 'BK 0123 ST',
    'BK 1111 UV', 'BK 2222 WX', 'BK 3333 YZ', 'BK 4444 AA', 'BK 5555 BB',
    'BK 6666 CC', 'BK 7777 DD', 'BK 8888 EE', 'BK 9999 FF', 'BK 0000 GG'
  ],
  afdelings: [
    { name: 'Afdeling I', description: 'Afdeling utama area utara' },
    { name: 'Afdeling II', description: 'Afdeling area selatan' },
    { name: 'Afdeling III', description: 'Afdeling area timur' },
    { name: 'Afdeling IV', description: 'Afdeling area barat' },
    { name: 'Afdeling V', description: 'Afdeling area tengah' },
    { name: 'Afdeling VI', description: 'Afdeling pengembangan 1' },
    { name: 'Afdeling VII', description: 'Afdeling pengembangan 2' },
    { name: 'Afdeling VIII', description: 'Afdeling cadangan 1' },
    { name: 'Afdeling IX', description: 'Afdeling cadangan 2' },
    { name: 'Afdeling X', description: 'Afdeling khusus' },
    { name: 'Afdeling XI', description: 'Afdeling perluasan 1' },
    { name: 'Afdeling XII', description: 'Afdeling perluasan 2' },
    { name: 'Afdeling XIII', description: 'Afdeling eksperimental 1' },
    { name: 'Afdeling XIV', description: 'Afdeling eksperimental 2' },
    { name: 'Afdeling XV', description: 'Afdeling organik' },
    { name: 'Afdeling XVI', description: 'Afdeling konservasi' },
    { name: 'Afdeling XVII', description: 'Afdeling riset' },
    { name: 'Afdeling XVIII', description: 'Afdeling pelatihan' },
    { name: 'Afdeling XIX', description: 'Afdeling demplot' },
    { name: 'Afdeling XX', description: 'Afdelite center' }
  ],
  pks: [
    { name: 'PKS Sawit Jaya', address: 'Jl. Industri No. 1, Medan', phone: '061-123456' },
    { name: 'PKS Kelapa Makmur', address: 'Jl. Raya No. 100, Pekanbaru', phone: '0761-234567' },
    { name: 'PKS Tani Sejahtera', address: 'Jl. Perkebunan No. 50, Palembang', phone: '0711-345678' },
    { name: 'PKS Agro Lestari', address: 'Jl. Pertanian No. 25, Jambi', phone: '0741-456789' },
    { name: 'PKS Bumi Karya', address: 'Jl. Produksi No. 75, Padang', phone: '0751-567890' },
    { name: 'PKS Harapan Baru', address: 'Jl. Industri No. 200, Bengkulu', phone: '0736-678901' },
    { name: 'PKS Makmur Bersama', address: 'Jl. Pabrik No. 150, Bandar Lampung', phone: '0721-789012' },
    { name: 'PKS Sumber Rezeki', address: 'Jl. Ekonomi No. 80, Pangkal Pinang', phone: '0717-890123' },
    { name: 'PKT Agro Mandiri', address: 'Jl. Usaha No. 120, Tanjung Pinang', phone: '0771-901234' },
    { name: 'PKS Jaya Abadi', address: 'Jl. Bisnis No. 60, Jakarta', phone: '021-012345' },
    { name: 'PKS Mitra Tani', address: 'Jl. Kerjasama No. 40, Bogor', phone: '0251-123456' },
    { name: 'PKS Prima Sawit', address: 'Jl. Kualitas No. 30, Tangerang', phone: '021-234567' },
    { name: 'PKS Global Palm', address: 'Jl. Ekspor No. 20, Bekasi', phone: '021-345678' },
    { name: 'PKS Inti Nusantara', address: 'Jl. Nasional No. 10, Depok', phone: '021-456789' },
    { name: 'PKS Trikarya', address: 'Jl. Mandiri No. 5, Semarang', phone: '024-567890' },
    { name: 'PKS Tiga Bersaudara', address: 'Jl. Persada No. 15, Surabaya', phone: '031-678901' },
    { name: 'PKS Maju Jaya', address: 'Jl. Inovasi No. 35, Malang', phone: '0341-789012' },
    { name: 'PKS Sejahtera Bersama', address: 'Jl. Kemitraan No. 45, Yogyakarta', phone: '0274-890123' },
    { name: 'PKS Cahaya Harapan', address: 'Jl. Terang No. 55, Solo', phone: '0271-901234' },
    { name: 'PKS Bintang Kejora', address: 'Jl. Fajar No. 65, Denpasar', phone: '0361-012345' }
  ],
  employeeDepartments: [
    { name: 'Direksi', description: 'Board of Directors - Executive management' },
    { name: 'Keuangan', description: 'Finance Department - Financial management and reporting' },
    { name: 'SDM', description: 'Human Resources - Employee management and development' },
    { name: 'Produksi', description: 'Production Department - Daily production operations' },
    { name: 'Kebun', description: 'Estate Department - Plantation management' },
    { name: 'Pabrik', description: 'Mill Department - Processing operations' },
    { name: 'Quality Control', description: 'QC Department - Quality assurance and control' },
    { name: 'Logistik', description: 'Logistics Department - Transportation and supply chain' },
    { name: 'Purchasing', description: 'Purchasing Department - Procurement and vendor management' },
    { name: 'IT', description: 'IT Department - Information technology and systems' },
    { name: 'Hukum', description: 'Legal Department - Legal compliance and contracts' },
    { name: 'Security', description: 'Security Department - Safety and security' },
    { name: 'Maintenance', description: 'Maintenance Department - Equipment and facility maintenance' },
    { name: 'Riset & Development', description: 'R&D Department - Research and innovation' },
    { name: 'Marketing', description: 'Marketing Department - Sales and marketing' },
    { name: 'Public Relations', description: 'PR Department - Corporate communications' },
    { name: 'Internal Audit', description: 'Audit Department - Internal controls and auditing' },
    { name: 'Training Center', description: 'Training Department - Employee training programs' },
    { name: 'Clinic/Hospital', description: 'Medical Department - Health services' },
    { name: 'General Affairs', description: 'GA Department - General administration and services' }
  ],
  employeePositions: [
    { name: 'Direktur Utama', level: 'Level 1' },
    { name: 'Direktur Keuangan', level: 'Level 1' },
    { name: 'Direktur Operasional', level: 'Level 1' },
    { name: 'General Manager', level: 'Level 2' },
    { name: 'Senior Manager', level: 'Level 3' },
    { name: 'Manager', level: 'Level 4' },
    { name: 'Assistant Manager', level: 'Level 5' },
    { name: 'Supervisor', level: 'Level 6' },
    { name: 'Senior Supervisor', level: 'Level 6' },
    { name: 'Foreman', level: 'Level 7' },
    { name: 'Senior Foreman', level: 'Level 7' },
    { name: 'Staff Senior', level: 'Level 8' },
    { name: 'Staff', level: 'Level 9' },
    { name: 'Junior Staff', level: 'Level 10' },
    { name: 'Kepala Regu', level: 'Level 8' },
    { name: 'Mandor', level: 'Level 9' },
    { name: 'Senior Analyst', level: 'Level 7' },
    { name: 'Analyst', level: 'Level 8' },
    { name: 'Junior Analyst', level: 'Level 9' },
    { name: 'Trainee', level: 'Level 11' }
  ],
  employeeGroups: [
    { name: 'TK/0', description: 'Tidak Kawin, 0 anak tanggungan' },
    { name: 'TK/1', description: 'Tidak Kawin, 1 anak tanggungan' },
    { name: 'TK/2', description: 'Tidak Kawin, 2 anak tanggungan' },
    { name: 'TK/3', description: 'Tidak Kawin, 3 anak tanggungan' },
    { name: 'K1/0', description: 'Kawin 1, 0 anak tanggungan' },
    { name: 'K1/1', description: 'Kawin 1, 1 anak tanggungan' },
    { name: 'K1/2', description: 'Kawin 1, 2 anak tanggungan' },
    { name: 'K1/3', description: 'Kawin 1, 3 anak tanggungan' },
    { name: 'K2/0', description: 'Kawin 2, 0 anak tanggungan' },
    { name: 'K2/1', description: 'Kawin 2, 1 anak tanggungan' },
    { name: 'K2/2', description: 'Kawin 2, 2 anak tanggungan' },
    { name: 'K2/3', description: 'Kawin 2, 3 anak tanggungan' },
    { name: 'K3/0', description: 'Kawin 3, 0 anak tanggungan' },
    { name: 'K3/1', description: 'Kawin 3, 1 anak tanggungan' },
    { name: 'K3/2', description: 'Kawin 3, 2 anak tanggungan' },
    { name: 'K3/3', description: 'Kawin 3, 3 anak tanggungan' },
    { name: 'K4/0', description: 'Kawin 4, 0 anak tanggungan' },
    { name: 'K4/1', description: 'Kawin 4, 1 anak tanggungan' },
    { name: 'K4/2', description: 'Kawin 4, 2 anak tanggungan' },
    { name: 'K4/3', description: 'Kawin 4, 3 anak tanggungan' }
  ],
  debtTypes: [
    { name: 'Hutang Bank', description: 'Pinjaman dari bank untuk operasional perusahaan' },
    { name: 'Hutang Supplier', description: 'Utang kepada pemasok barang dan jasa' },
    { name: 'Hutang Gaji', description: 'Kewajiban pembayaran gaji karyawan' },
    { name: 'Hutang Pajak', description: 'Utang pajak yang harus dibayarkan ke pemerintah' },
    { name: 'Hutang Sewa', description: 'Utang pembayaran sewa aset dan properti' },
    { name: 'Hutang Listrik', description: 'Utang pembayaran tagihan listrik' },
    { name: 'Hutang Air', description: 'Utang pembayaran tagihan air' },
    { name: 'Hutang Telepon', description: 'Utang pembayaran tagihan telepon dan internet' },
    { name: 'Hutang Asuransi', description: 'Utang premi asuransi karyawan dan aset' },
    { name: 'Hutang Bonus', description: 'Kewajiban pembayaran bonus tahunan' },
    { name: 'Hutang THR', description: 'Kewajiban pembayaran tunjangan hari raya' },
    { name: 'Hutang Transportasi', description: 'Utang biaya transportasi dan pengiriman' },
    { name: 'Hutang Bahan Bakar', description: 'Utang pembelian bahan bakar kendaraan' },
    { name: 'Hutang Pupuk', description: 'Utang pembelian pupuk dan pestisida' },
    { name: 'Hutang Benih', description: 'Utang pembelian benih tanaman' },
    { name: 'Hutang Suvenir', description: 'Utang pembelian suvenir dan merchandise' },
    { name: 'Hutang Konsumsi', description: 'Utang pembelian barang konsumsi kantor' },
    { name: 'Hutang Perjalanan Dinas', description: 'Utang biaya perjalanan dinas karyawan' },
    { name: 'Hutang Pelatihan', description: 'Utang biaya pelatihan dan pengembangan' },
    { name: 'Hutang Lain-lain', description: 'Utang-utang lain yang belum terkategori' }
  ],
  bkkExpenseCategories: [
    { name: 'Gaji Harian', description: 'Pembayaran gaji pekerja harian' },
    { name: 'Lembur', description: 'Pembayaran upah lembur karyawan' },
    { name: 'Transportasi', description: 'Biaya transportasi dan perjalanan' },
    { name: 'Konsumsi', description: 'Biaya makan dan minuman kegiatan' },
    { name: 'Bahan Bakar', description: 'Pembelian BBM untuk kendaraan operasional' },
    { name: 'Perawatan Kendaraan', description: 'Biaya service dan perbaikan kendaraan' },
    { name: 'Sparepart', description: 'Pembelian suku cadang kendaraan dan mesin' },
    { name: 'Alat Tulis Kantor', description: 'Pembelian ATK untuk operasional kantor' },
    { name: 'Listrik & Air', description: 'Pembayaran tagihan listrik dan air' },
    { name: 'Telekomunikasi', description: 'Biaya telepon, internet, dan komunikasi' },
    { name: 'Pupuk & Pestisida', description: 'Pembelian pupuk dan obat-obatan tanaman' },
    { name: 'Benih', description: 'Pembelian benih untuk penanaman' },
    { name: 'Herbisida', description: 'Pembelian obat pembunuh gulma' },
    { name: 'Insektisida', description: 'Pembelian obat pembasmi hama' },
    { name: 'Fungisida', description: 'Pembelian obat pembasmi jamur' },
    { name: 'Peralatan Kebun', description: 'Pembelian peralatan dan perlengkapan kebun' },
    { name: 'Seragam', description: 'Pembelian seragam dan AP kerja' },
    { name: 'Medical', description: 'Biaya kesehatan dan obat-obatan' },
    { name: 'Keamanan', description: 'Biaya keamanan dan satpam' },
    { name: 'Rumah Tangga', description: 'Biaya rumah tangga dan mess karyawan' }
  ]
};

async function seedMasterData() {
  console.log('🌱 Starting to seed master data...');

  try {
    // Clear existing data
    await db.delete(masterBkkExpenseCategories);
    await db.delete(masterDebtTypes);
    await db.delete(masterEmployeeGroups);
    await db.delete(masterEmployeePositions);
    await db.delete(masterEmployeeDepartments);
    await db.delete(masterPks);
    await db.delete(masterAfdelings);
    await db.delete(masterVehicles);
    console.log('🗑️ Cleared existing master data');

    // Insert Vehicles
    for (const noPol of seedData.vehicles) {
      await db.insert(masterVehicles).values({ noPol });
    }
    console.log(`✅ Inserted ${seedData.vehicles.length} vehicles`);

    // Insert Afdelings
    for (const afdeling of seedData.afdelings) {
      await db.insert(masterAfdelings).values(afdeling);
    }
    console.log(`✅ Inserted ${seedData.afdelings.length} afdelings`);

    // Insert PKS
    for (const pks of seedData.pks) {
      await db.insert(masterPks).values(pks);
    }
    console.log(`✅ Inserted ${seedData.pks.length} PKS`);

    // Insert Employee Departments
    for (const dept of seedData.employeeDepartments) {
      await db.insert(masterEmployeeDepartments).values(dept);
    }
    console.log(`✅ Inserted ${seedData.employeeDepartments.length} employee departments`);

    // Insert Employee Positions
    for (const position of seedData.employeePositions) {
      await db.insert(masterEmployeePositions).values(position);
    }
    console.log(`✅ Inserted ${seedData.employeePositions.length} employee positions`);

    // Insert Employee Groups
    for (const group of seedData.employeeGroups) {
      await db.insert(masterEmployeeGroups).values(group);
    }
    console.log(`✅ Inserted ${seedData.employeeGroups.length} employee groups`);

    // Insert Debt Types
    for (const debtType of seedData.debtTypes) {
      await db.insert(masterDebtTypes).values(debtType);
    }
    console.log(`✅ Inserted ${seedData.debtTypes.length} debt types`);

    // Insert BKK Expense Categories
    for (const category of seedData.bkkExpenseCategories) {
      await db.insert(masterBkkExpenseCategories).values(category);
    }
    console.log(`✅ Inserted ${seedData.bkkExpenseCategories.length} BKK expense categories`);

    console.log('🎉 Master data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Vehicles: ${seedData.vehicles.length} records`);
    console.log(`   - Afdelings: ${seedData.afdelings.length} records`);
    console.log(`   - PKS: ${seedData.pks.length} records`);
    console.log(`   - Employee Departments: ${seedData.employeeDepartments.length} records`);
    console.log(`   - Employee Positions: ${seedData.employeePositions.length} records`);
    console.log(`   - Employee Groups: ${seedData.employeeGroups.length} records`);
    console.log(`   - Debt Types: ${seedData.debtTypes.length} records`);
    console.log(`   - BKK Expense Categories: ${seedData.bkkExpenseCategories.length} records`);
    console.log('\n📝 Total: 160 master data records inserted');

  } catch (error) {
    console.error('❌ Error seeding master data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedMasterData()
  .then(() => {
    console.log('\n✨ Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  });