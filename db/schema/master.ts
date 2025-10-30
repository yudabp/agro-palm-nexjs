import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Master Vehicles - Menyimpan Nomor Polisi
export const masterVehicles = pgTable("master_vehicles", {
  id: serial("id").primaryKey(),
  noPol: varchar("no_pol", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master Afdelings - Menyimpan data Afdeling
export const masterAfdelings = pgTable("master_afdelings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master PKS - Menyimpan data PKS (Pabrik Kelapa Sawit)
export const masterPks = pgTable("master_pks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master Employee Departments - Menyimpan data Bagian Karyawan
export const masterEmployeeDepartments = pgTable("master_employee_departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master Employee Positions - Menyimpan data Jabatan
export const masterEmployeePositions = pgTable("master_employee_positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  level: varchar("level", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master Employee Groups - Menyimpan data Golongan/Susunan Keluarga
export const masterEmployeeGroups = pgTable("master_employee_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master Debt Types - Menyimpan data perihal hutang
export const masterDebtTypes = pgTable("master_debt_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Master BKK Expense Categories - Menyimpan Kategori Pengeluaran BKK
export const masterBkkExpenseCategories = pgTable("master_bkk_expense_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});