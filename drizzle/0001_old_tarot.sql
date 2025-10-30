CREATE TYPE "public"."bkk_type" AS ENUM('Pemasukan', 'Pengeluaran');--> statement-breakpoint
CREATE TYPE "public"."company_finance_type" AS ENUM('Pemasukan', 'Pengeluaran');--> statement-breakpoint
CREATE TYPE "public"."debt_status" AS ENUM('Belum Lunas', 'Lunas');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "master_afdelings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "master_bkk_expense_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_bkk_expense_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "master_debt_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_debt_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "master_employee_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_employee_departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "master_employee_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_employee_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "master_employee_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_employee_positions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "master_pks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(255),
	"phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "master_vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"no_pol" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_vehicles_no_pol_unique" UNIQUE("no_pol")
);
--> statement-breakpoint
CREATE TABLE "data_produksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"no_sp" varchar(50) NOT NULL,
	"tanggal" date NOT NULL,
	"vehicle_id" integer,
	"jumlah_tbs" integer NOT NULL,
	"jumlah_kg" numeric(10, 2) NOT NULL,
	"afdeling_id" integer,
	"pks_id" integer,
	"foto_urls" text,
	"created_by_user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "data_produksi_no_sp_unique" UNIQUE("no_sp")
);
--> statement-breakpoint
CREATE TABLE "data_penjualan" (
	"id" serial PRIMARY KEY NOT NULL,
	"sp_number" varchar(50) NOT NULL,
	"produksi_id" integer,
	"tbs_quantity" numeric(10, 2),
	"kg_quantity" numeric(10, 2) NOT NULL,
	"price_per_kg" numeric(15, 2) NOT NULL,
	"total_amount" numeric(15, 2) NOT NULL,
	"is_taxable" boolean DEFAULT false NOT NULL,
	"tax_percentage" numeric(5, 2) DEFAULT 11 NOT NULL,
	"tax_amount" numeric(15, 2) DEFAULT 0 NOT NULL,
	"sale_date" date NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_address" text,
	"sales_proof_path" varchar(500),
	"created_by_user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_karyawan" (
	"id" serial PRIMARY KEY NOT NULL,
	"ndp" varchar(20) NOT NULL,
	"nama" varchar(255) NOT NULL,
	"department_id" integer,
	"position_id" integer,
	"group_id" integer,
	"gaji_bulanan" numeric(12, 2),
	"status" varchar(20) DEFAULT 'Aktif' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "data_karyawan_ndp_unique" UNIQUE("ndp")
);
--> statement-breakpoint
CREATE TABLE "buku_kas_kebun" (
	"id" serial PRIMARY KEY NOT NULL,
	"tanggal" date NOT NULL,
	"tipe" "bkk_type" NOT NULL,
	"deskripsi" varchar(255) NOT NULL,
	"penerima" varchar(255),
	"expense_category_id" integer,
	"jumlah" numeric(15, 2) NOT NULL,
	"bukti_url" varchar(500),
	"catatan" text,
	"kp_id" integer,
	"created_by_user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_hutang" (
	"id" serial PRIMARY KEY NOT NULL,
	"tanggal_hutang" date NOT NULL,
	"kreditor" varchar(255) NOT NULL,
	"debt_type_id" integer,
	"jumlah_hutang" numeric(15, 2) NOT NULL,
	"sisa_hutang" numeric(15, 2) NOT NULL,
	"cicilan_per_bulan" numeric(15, 2),
	"status" "debt_status" DEFAULT 'Belum Lunas' NOT NULL,
	"created_by_user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hutang_pembayaran" (
	"id" serial PRIMARY KEY NOT NULL,
	"hutang_id" integer,
	"bkk_id" integer,
	"tanggal_bayar" date NOT NULL,
	"jumlah_bayar" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keuangan_perusahaan" (
	"id" serial PRIMARY KEY NOT NULL,
	"tanggal" date NOT NULL,
	"tipe" "company_finance_type" NOT NULL,
	"deskripsi" varchar(255) NOT NULL,
	"penerima" varchar(255),
	"jumlah" numeric(15, 2) NOT NULL,
	"bukti_url" varchar(500),
	"catatan" text,
	"created_by_user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "data_produksi" ADD CONSTRAINT "data_produksi_vehicle_id_master_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."master_vehicles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_produksi" ADD CONSTRAINT "data_produksi_afdeling_id_master_afdelings_id_fk" FOREIGN KEY ("afdeling_id") REFERENCES "public"."master_afdelings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_produksi" ADD CONSTRAINT "data_produksi_pks_id_master_pks_id_fk" FOREIGN KEY ("pks_id") REFERENCES "public"."master_pks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_produksi" ADD CONSTRAINT "data_produksi_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_penjualan" ADD CONSTRAINT "data_penjualan_produksi_id_data_produksi_id_fk" FOREIGN KEY ("produksi_id") REFERENCES "public"."data_produksi"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_penjualan" ADD CONSTRAINT "data_penjualan_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_karyawan" ADD CONSTRAINT "data_karyawan_department_id_master_employee_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."master_employee_departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_karyawan" ADD CONSTRAINT "data_karyawan_position_id_master_employee_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."master_employee_positions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_karyawan" ADD CONSTRAINT "data_karyawan_group_id_master_employee_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."master_employee_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buku_kas_kebun" ADD CONSTRAINT "buku_kas_kebun_expense_category_id_master_bkk_expense_categories_id_fk" FOREIGN KEY ("expense_category_id") REFERENCES "public"."master_bkk_expense_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buku_kas_kebun" ADD CONSTRAINT "buku_kas_kebun_kp_id_keuangan_perusahaan_id_fk" FOREIGN KEY ("kp_id") REFERENCES "public"."keuangan_perusahaan"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buku_kas_kebun" ADD CONSTRAINT "buku_kas_kebun_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_hutang" ADD CONSTRAINT "data_hutang_debt_type_id_master_debt_types_id_fk" FOREIGN KEY ("debt_type_id") REFERENCES "public"."master_debt_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_hutang" ADD CONSTRAINT "data_hutang_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hutang_pembayaran" ADD CONSTRAINT "hutang_pembayaran_hutang_id_data_hutang_id_fk" FOREIGN KEY ("hutang_id") REFERENCES "public"."data_hutang"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hutang_pembayaran" ADD CONSTRAINT "hutang_pembayaran_bkk_id_buku_kas_kebun_id_fk" FOREIGN KEY ("bkk_id") REFERENCES "public"."buku_kas_kebun"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keuangan_perusahaan" ADD CONSTRAINT "keuangan_perusahaan_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;