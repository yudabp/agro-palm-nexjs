import { pgTable, serial, varchar, date, integer, decimal, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { masterBkkExpenseCategories } from "./master";
import { masterDebtTypes } from "./master";

// Enum types
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);
export const companyFinanceTypeEnum = pgEnum("company_finance_type", ["Pemasukan", "Pengeluaran"]);
export const bkkTypeEnum = pgEnum("bkk_type", ["Pemasukan", "Pengeluaran"]);
export const debtStatusEnum = pgEnum("debt_status", ["Belum Lunas", "Lunas"]);

// Keuangan Perusahaan (KP)
export const keuanganPerusahaan = pgTable("keuangan_perusahaan", {
  id: serial("id").primaryKey(),
  tanggal: date("tanggal").notNull(),
  tipe: companyFinanceTypeEnum("tipe").notNull(),
  deskripsi: varchar("deskripsi", { length: 255 }).notNull(),
  penerima: varchar("penerima", { length: 255 }),
  jumlah: decimal("jumlah", { precision: 15, scale: 2 }).notNull(),
  buktiUrl: varchar("bukti_url", { length: 500 }),
  catatan: text("catatan"),
  createdByUserId: varchar("created_by_user_id", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Buku Kas Kebun (BKK)
export const bukuKasKebun = pgTable("buku_kas_kebun", {
  id: serial("id").primaryKey(),
  tanggal: date("tanggal").notNull(),
  tipe: bkkTypeEnum("tipe").notNull(),
  deskripsi: varchar("deskripsi", { length: 255 }).notNull(),
  penerima: varchar("penerima", { length: 255 }),
  expenseCategoryId: integer("expense_category_id").references(() => masterBkkExpenseCategories.id, { onDelete: "set null" }),
  jumlah: decimal("jumlah", { precision: 15, scale: 2 }).notNull(),
  buktiUrl: varchar("bukti_url", { length: 500 }),
  catatan: text("catatan"),
  kpId: integer("kp_id").references(() => keuanganPerusahaan.id, { onDelete: "set null" }),
  createdByUserId: varchar("created_by_user_id", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Data Hutang (HT)
export const dataHutang = pgTable("data_hutang", {
  id: serial("id").primaryKey(),
  tanggalHutang: date("tanggal_hutang").notNull(),
  kreditor: varchar("kreditor", { length: 255 }).notNull(),
  debtTypeId: integer("debt_type_id").references(() => masterDebtTypes.id, { onDelete: "set null" }),
  jumlahHutang: decimal("jumlah_hutang", { precision: 15, scale: 2 }).notNull(),
  sisaHutang: decimal("sisa_hutang", { precision: 15, scale: 2 }).notNull(),
  cicilanPerBulan: decimal("cicilan_per_bulan", { precision: 15, scale: 2 }),
  status: debtStatusEnum("status").notNull().default("Belum Lunas"),
  createdByUserId: varchar("created_by_user_id", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Hutang Pembayaran
export const hutangPembayaran = pgTable("hutang_pembayaran", {
  id: serial("id").primaryKey(),
  hutangId: integer("hutang_id").references(() => dataHutang.id, { onDelete: "cascade" }),
  bkkId: integer("bkk_id").references(() => bukuKasKebun.id, { onDelete: "cascade" }),
  tanggalBayar: date("tanggal_bayar").notNull(),
  jumlahBayar: decimal("jumlah_bayar", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});