### **Technical Specification (Versi 2.0): Agro Palma Data Management Dashboard**

Dokumen ini adalah versi terbaru yang mengintegrasikan detail visual dari alur data yang diberikan.

## 1. Ikhtisar Teknis (Tidak Berubah)

**Tujuan Proyek:** Membangun aplikasi *dashboard web responsive* untuk sentralisasi, manajemen (CRUD), dan visualisasi data perusahaan (Produksi, Penjualan, Keuangan, Karyawan) secara *real-time*.

**Target Pengguna & Peran (Roles):**
1.  **Direksi (Read-only and Export)**
2.  **Superadmin (Full Access)**

**Tech Stack Implementation:**
* **Frontend:** Next.js 15 (App Router + Turbopack) + TypeScript
* **Backend:** Next.js API Routes + Better Auth
* **Database:** PostgreSQL + Drizzle ORM
* **UI Components:** shadcn/ui + Tailwind CSS
* **Icons:** Lucide React
* **Visualisasi Data:** Chart.js, D3.js, atau ECharts. Sesuai denga library atau component yang tersedia di project
* **Penyimpanan File:** AWS S3, Google Cloud Storage, atau penyimpanan lokal di server untuk menangani unggahan foto/bukti

---

## 2. Model Data (Skema Database) - Diperbarui

Berdasarkan *flowchart*, skema database diperbarui secara signifikan untuk mencakup relasi dan data master.

#### Tabel Master / Lookup (Data Pilihan)
Tabel-tabel ini penting untuk fitur "jika tidak ada bisa tambah".

* **`master_vehicles`**: Menyimpan Nomor Polisi (`no_pol`).
* **`master_afdelings`**: Menyimpan data Afdeling.
* **`master_pks`**: Menyimpan data PKS (Pabrik Kelapa Sawit).
* **`master_employee_departments`**: Menyimpan data Bagian Karyawan (Staff, Pegawai, dll).
* **`master_employee_positions`**: Menyimpan data Jabatan (Direktur, Manager, dll).
* **`master_employee_groups`**: Menyimpan data Golongan/Susunan Keluarga.
* **`master_debt_types`**: Menyimpan data perihal hutang (Susu Tunggakan, Investor, dll).
* **`master_bkk_expense_categories`**: Menyimpan Kategori Pengeluaran BKK (Gaji, Hutang, Operasional).

#### Tabel Transaksional Utama

1.  **`users`** dan **`roles`** (Tidak berubah)

2.  **`data_produksi` (Diperbarui)**
    * `id` (PK)
    * `no_sp` (string, **unique**, key untuk relasi ke penjualan)
    * `tanggal` (date)
    * `vehicle_id` (FK ke `master_vehicles.id`)
    * `jumlah_tbs` (integer)
    * `jumlah_kg` (decimal)
    * `afdeling_id` (FK ke `master_afdelings.id`)
    * `pks_id` (FK ke `master_pks.id`)
    * `foto_urls` (JSON atau TEXT, untuk menyimpan array path file)
    * `created_by_user_id` (FK ke `users.id`)
    * `created_at`, `updated_at`

3.  **`data_penjualan` (Diperbarui)**
    * `id` (PK)
    * `sp_number` (string, **bisa manual atau dari produksi**)
    * `produksi_id` (FK ke `data_produksi.id`, **nullable untuk support input manual**)
    * `tbs_quantity` (decimal, **bisa manual atau dari produksi**)
    * `kg_quantity` (decimal, **bisa manual atau dari produksi**)
    * `price_per_kg` (decimal)
    * `total_amount` (decimal, **dihitung otomatis: kg_quantity × price_per_kg**)
    * `is_taxable` (boolean, default: false)
    * `tax_percentage` (decimal, default: 11.00, **0 jika tidak taxable**)
    * `tax_amount` (decimal, **dihitung otomatis: total_amount × tax_percentage / 100**)
    * `sale_date` (date)
    * `customer_name` (string)
    * `customer_address` (text)
    * `sales_proof_path` (string, nullable, path ke file bukti penjualan)
    * `created_by_user_id` (FK ke `users.id`)
    * `created_at`, `updated_at`

4.  **`data_karyawan` (Diperbarui)**
    * `id` (PK)
    * `ndp` (string, unique)
    * `nama` (string)
    * `department_id` (FK ke `master_employee_departments.id`)
    * `position_id` (FK ke `master_employee_positions.id`)
    * `group_id` (FK ke `master_employee_groups.id`)
    * `gaji_bulanan` (decimal)
    * `status` (string, enum: 'Aktif', 'Tidak Aktif', 'A.IM')
    * `created_at`, `updated_at`

5.  **`keuangan_perusahaan (KP)` (Diperbarui)**
    * `id` (PK)
    * `tanggal` (date)
    * `tipe` (enum: 'Pemasukan', 'Pengeluaran')
    * `deskripsi` (string, mis: 'Pemasukan Dari X' atau 'Pengeluaran Untuk Y')
    * `penerima` (string)
    * `jumlah` (decimal)
    * `bukti_url` (string, path ke file gambar)
    * `catatan` (text)
    * `created_by_user_id` (FK ke `users.id`)
    * `created_at`, `updated_at`

6.  **`buku_kas_kebun (BKK)` (Diperbarui)**
    * `id` (PK)
    * `tanggal` (date)
    * `tipe` (enum: 'Pemasukan', 'Pengeluaran')
    * `deskripsi` (string)
    * `penerima` (string, untuk Pemasukan)
    * `expense_category_id` (FK ke `master_bkk_expense_categories.id`, untuk Pengeluaran)
    * `jumlah` (decimal)
    * `bukti_url` (string)
    * `catatan` (text)
    * `kp_id` (FK ke `keuangan_perusahaan.id`, nullable)
    * `created_by_user_id` (FK ke `users.id`)
    * `created_at`, `updated_at`

7.  **`data_hutang (HT)` (Diperbarui)**
    * `id` (PK)
    * `tanggal_hutang` (date)
    * `kreditor` (string, 'Hutang Kepada')
    * `debt_type_id` (FK ke `master_debt_types.id`, 'Utang Perihal')
    * `jumlah_hutang` (decimal)
    * `sisa_hutang` (decimal, **diupdate oleh pembayaran**)
    * `cicilan_per_bulan` (decimal)
    * `status` (enum: 'Belum Lunas', 'Lunas')
    * `created_by_user_id` (FK ke `users.id`)
    * `created_at`, `updated_at`

8.  **`hutang_pembayaran` (Tabel Baru)**
    * `id` (PK)
    * `hutang_id` (FK ke `data_hutang.id`)
    * `bkk_id` (FK ke `buku_kas_kebun.id`, sebagai bukti pembayaran)
    * `tanggal_bayar` (date)
    * `jumlah_bayar` (decimal)

---

## 3. Logika Bisnis Kunci (Wajib Diimplementasikan) - Diperbarui

1.  **Alur Pembuatan Data Penjualan (Diperbarui dengan Pajak & Autocomplete):**
    * **Trigger:** User memulai input data penjualan.
    * **Aksi:**
        1.  UI menyediakan **search autocomplete** untuk `SP Number` (minimal 2 karakter).
        2.  Sistem menampilkan suggestions dari tabel `data_produksi` dengan info TBS & KG quantity.
        3.  **Jika user pilih suggestion:** Data TBS & KG quantity terisi otomatis (bisa diedit).
        4.  **Jika user input manual SP Number:** User bisa input semua data secara manual.
        5.  User menginput `Price per KG` dan `Customer Information`.
        6.  `Total Amount` dihitung otomatis (`KG Quantity` × `Price per KG`).
        7.  **Fitur Pajak:** User bisa centang "Kena Pajak" untuk mengaktifkan kalkulasi pajak:
            - Default tax percentage: 11%
            - Tax amount dihitung otomatis: `Total Amount × Tax Percentage / 100`
            - Total dengan pajak: `Total Amount + Tax Amount`
        8.  User bisa upload `Sales Proof` (file gambar).
        9.  Saat disimpan, semua data disimpan ke tabel `data_penjualan` dengan proper validation.

2.  **Alur Keterkaitan KP ke BKK (Tetap):**
    * Saat Superadmin membuat entri `Pengeluaran` di KP, sistem secara otomatis membuat entri `Pemasukan` di BKK.

3.  **Alur Pelunasan Hutang melalui BKK (Diperbarui & Lebih Detail):**
    * **Trigger:** User membuat entri `Pengeluaran` di BKK dan memilih kategori `expense_category_id` yang merujuk pada "Hutang".
    * **Aksi:**
        1.  UI akan menampilkan *dropdown* atau *searchable list* untuk memilih hutang yang masih berstatus 'Belum Lunas' dari tabel `data_hutang`.
        2.  User memasukkan jumlah yang dibayarkan.
        3.  Saat disimpan, backend akan:
            a. Membuat entri di BKK.
            b. Membuat entri baru di tabel `hutang_pembayaran` yang menautkan pembayaran ini (via `bkk_id`) ke hutang yang relevan (via `hutang_id`).
            c. Mengurangi `sisa_hutang` di tabel `data_hutang`.
            d. Mengubah `status` hutang menjadi 'Lunas' jika `sisa_hutang` <= 0.

4.  **Manajemen Data Master (BARU):**
    * Untuk setiap data master (Kendaraan, Afdeling, PKS, dll.), UI harus menyediakan antarmuka sederhana (CRUD) agar Superadmin bisa menambahkan opsi baru sesuai kebutuhan.

---

## 4. Spesifikasi API Endpoints (Diperbarui)

#### Endpoints Data Master (BARU)
* `GET, POST /api/master/vehicles`
* `GET, POST /api/master/afdelings`
* `GET, POST /api/master/pks`
* (dan seterusnya untuk semua tabel master)

#### Endpoints Transaksional
* `POST /api/penjualan`: Body request kini cukup berisi `{ "no_sp": "...", "harga_jual_per_kg": ... }`. Backend akan menangani sisanya.
* `POST /api/penjualan`: Body request menyertakan data lengkap penjualan dengan fitur pajak:
  ```json
  {
    "sp_number": "SP-2025-001",
    "production_id": 123, // nullable untuk input manual
    "tbs_quantity": 1500.50,
    "kg_quantity": 1200.75,
    "price_per_kg": 1500,
    "customer_name": "Customer Name",
    "customer_address": "Customer Address",
    "is_taxable": true,
    "tax_percentage": 11.00,
    "sales_proof": "file" // optional
  }
  ```
* `GET /api/penjualan/search?q={query}`: Search autocomplete untuk SP number
* `GET /api/penjualan/export?filter={all|taxable|non_taxable}`: Export data penjualan dengan filter pajak
* `POST /api/produksi`, `POST /api/keuangan/kp`, `POST /api/keuangan/bkk`: Endpoint ini harus mendukung `multipart/form-data` untuk menangani unggahan file.
* `GET /api/dashboard/insights`: Endpoint ini harus diperbarui untuk memberikan data agregat seperti yang digambarkan di "Sistem Digital Map":
    * `total_produksi_kg`
    * `total_penjualan_rp`
    * `total_pemasukan` (dengan rincian dari KP dan BKK)
    * `total_pengeluaran` (dengan rincian dari KP dan BKK)
    * `total_sisa_hutang`
    * `jumlah_karyawan_aktif`

---

## 5. Rencana Sprint Teknis (2 Minggu) - Disesuaikan

### **Minggu 1: Fondasi, Master Data & Modul Dasar**
* **Backend:**
    * Setup proyek, database, dan autentikasi.
    * Implementasi skema database **lengkap** (termasuk tabel master).
    * Implementasi API CRUD untuk **semua tabel Master**.
    * Implementasi mekanisme **unggah file**.
    * Implementasi API CRUD untuk **Data Produksi** & **Data Karyawan**.
* **Frontend:**
    * Setup proyek, login, dan layout.
    * Implementasi modul UI untuk **semua Master Data**.
    * Implementasi modul UI untuk **Data Produksi** (termasuk upload foto).
    * Implementasi modul UI untuk **Data Karyawan**.

### **Minggu 2: Modul Kompleks & Finalisasi**
* **Backend:**
    * Implementasi API CRUD untuk **Data Penjualan** dengan **logika lookup No. SP**.
    * Implementasi API CRUD untuk semua modul **Keuangan (KP, BKK, HT)**.
    * Implementasi **Logika Bisnis Kunci** (KP -> BKK dan Pelunasan Hutang BKK -> HT).
    * Implementasi endpoint `/api/dashboard/insights`.
* **Frontend:**
    * Implementasi modul UI untuk **Data Penjualan** (dengan alur lookup).
    * Implementasi modul UI untuk **Keuangan** (KP, BKK, HT), pastikan UI mendukung alur pelunasan hutang.
    * Implementasi halaman **Dashboard (Ringkasan)** dengan visualisasi data.
* **Deployment & Testing:** Deploy ke staging dan lakukan pengujian E2E (End-to-End).

---

## 6. Implementasi KP → BKK Auto-create (Update Terbaru)

### **Arsitektur Implementasi**

#### **Backend Components (Next.js API Routes)**
1. **FinancialService** (`lib/services/financial-service.ts`)
   - Service layer untuk semua logika transaksi keuangan
   - Method `createKpWithAutoBkk()` untuk pembuatan transaksi terintegrasi
   - Category mapping antara KP dan BKK
   - Relationship management antara KP dan BKK
   - Error handling dengan proper rollback dan logging

2. **Database Models** (`db/schema/index.ts`)
   - `keuangan_perusahaan` has many `buku_kas_kebun`
   - `buku_kas_kebun` belongs to `keuangan_perusahaan`
   - Foreign key constraint dengan `ON DELETE SET NULL`
   - Type-safe dengan Drizzle ORM

3. **API Route Handlers**
   - `app/api/transactions/kp/route.ts` - Keuangan Perusahaan (KP) API
   - `app/api/transactions/bkk/route.ts` - Buku Kas Kebun (BKK) API
   - Otomatis membuat BKK entry untuk KP expense transactions

#### **Frontend Components (React/Next.js)**
1. **KPTransactionComponent** (`app/dashboard/transactions/kp/page.tsx`)
   - Menggunakan FinancialService untuk pembuatan transaksi
   - Menampilkan related BKK transactions
   - Visual indicators untuk auto-generated entries
   - Modal untuk melihat detail hubungan KP → BKK

2. **BKKTransactionComponent** (`app/dashboard/transactions/bkk/page.tsx`)
   - Menampilkan related KP transaction
   - Method untuk mengecek auto-generated entries
   - Integration dengan KP data untuk audit trail
   - React hooks untuk state management

### **Flow Implementation**

#### **Alur KP → BKK Auto-create**
1. **Trigger**: User membuat KP expense transaction melalui API POST
2. **Service Processing**: `FinancialService.createKpWithAutoBkk()` dipanggil
3. **BKK Creation**:
   - Generate BKK transaction number dengan prefix "BKK-AUTO-"
   - Set transaction type sebagai "income" (berlawanan dengan KP "expense")
   - Copy amount, date, dan metadata dari KP
   - Set `kp_id` foreign key untuk relasi
   - Map category dari KP ke BKK
4. **Database Transaction**: Atomic operation dengan rollback jika gagal
5. **Logging**: Catat semua aktivitas untuk audit trail
6. **API Response**: Return KP dan BKK entries yang dibuat
7. **UI Update**: Tampilkan notifikasi ke user tentang BKK auto-created

#### **Category Mapping Logic**
```typescript
// lib/services/financial-service.ts
const categoryMapping = {
  'Personnel Cost': 'Operational Cost',
  'Administrative Cost': 'Operational Cost',
  'Financial Cost': 'Operational Cost',
  'Investment': 'Operational Cost',
  'Other Expense': 'Operational Cost',
  'default': 'Other Income'
};
```

### **Database Schema Implementation**

#### **Tabel keuangan_perusahaan (Drizzle Schema)**
```typescript
// db/schema/financial.ts
export const keuanganPerusahaan = pgTable('keuangan_perusahaan', {
  id: serial('id').primaryKey(),
  transactionDate: date('transaction_date').notNull(),
  transactionNumber: varchar('transaction_number', { length: 255 }).unique().notNull(),
  transactionType: pgEnum('transaction_type', ['income', 'expense']).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  sourceDestination: varchar('source_destination', { length: 255 }),
  receivedBy: varchar('received_by', { length: 255 }),
  proofDocumentPath: varchar('proof_document_path', { length: 255 }),
  notes: text('notes'),
  category: varchar('category', { length: 255 }),
  createdByUserId: integer('created_by_user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Indexes
export const keuanganPerusahaanRelations = relations(keuanganPerusahaan, ({ many }) => ({
  bukuKasKebun: many(bukuKasKebun),
  user: one(user, {
    fields: [keuanganPerusahaan.createdByUserId],
    references: [user.id],
  }),
}));
```

#### **Tabel buku_kas_kebun (Drizzle Schema)**
```typescript
// db/schema/financial.ts
export const bukuKasKebun = pgTable('buku_kas_kebun', {
  id: serial('id').primaryKey(),
  transactionDate: date('transaction_date').notNull(),
  transactionNumber: varchar('transaction_number', { length: 255 }).unique().notNull(),
  transactionType: pgEnum('transaction_type', ['income', 'expense']).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  sourceDestination: varchar('source_destination', { length: 255 }),
  receivedBy: varchar('received_by', { length: 255 }),
  proofDocumentPath: varchar('proof_document_path', { length: 255 }),
  notes: text('notes'),
  category: varchar('category', { length: 255 }),
  kpId: integer('kp_id').references(() => keuanganPerusahaan.id, { onDelete: 'set null' }),
  createdByUserId: integer('created_by_user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const bukuKasKebunRelations = relations(bukuKasKebun, ({ one }) => ({
  keuanganPerusahaan: one(keuanganPerusahaan, {
    fields: [bukuKasKebun.kpId],
    references: [keuanganPerusahaan.id],
  }),
  user: one(user, {
    fields: [bukuKasKebun.createdByUserId],
    references: [user.id],
  }),
}));
```

#### **Migration Commands**
```bash
npm run db:generate    # Generate migration files
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio (optional)
```

### **Testing & Validation**

#### **Test Cases Covered**
1. **KP Expense Creation**: Verify BKK income auto-created
2. **KP Income Creation**: Verify no BKK auto-created
3. **Error Handling**: Verify rollback on failure
4. **Data Integrity**: Verify foreign key constraints
5. **Category Mapping**: Verify proper category transformation
6. **Audit Trail**: Verify logging functionality

#### **Performance Considerations**
- Database indexing untuk query optimization
- Eager loading untuk relationships
- Proper memory management untuk large datasets
- Caching strategy untuk frequently accessed data

---

## 7. Kriteria Penerimaan Teknis (Ditambahkan)
* **Alur Penjualan:** - Membuat entri penjualan dengan SP autocomplete dan pajak feature berjalan sempurna.
* **Alur Keuangan:** - Transaksi pengeluaran dari KP secara otomatis tercermin sebagai pemasukan di BKK.
* **Alur Hutang:** - Pembayaran hutang melalui BKK dengan tracking sisa hutang dan riwayat pembayaran.
* **Unggah File:** - Pengguna bisa mengunggah dan melihat kembali gambar bukti pada semua modul.
* **Data Master:** - Superadmin bisa menambahkan opsi baru pada form melalui antarmuka manajemen data master.
* **KP → BKK Integration:** - Sistem otomatis membuat entri BKK saat ada pengeluaran KP dengan proper audit trail.
* **Data Integrity:** - Semua relasi foreign key terjaga dengan proper constraints dan error handling.

