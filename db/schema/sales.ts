import { pgTable, serial, varchar, date, integer, decimal, boolean, text, timestamp } from "drizzle-orm/pg-core";
import { dataProduksi } from "./production";
import { user } from "./auth";

// Data Penjualan
export const dataPenjualan = pgTable("data_penjualan", {
  id: serial("id").primaryKey(),
  spNumber: varchar("sp_number", { length: 50 }).notNull(),
  produksiId: integer("produksi_id").references(() => dataProduksi.id, { onDelete: "set null" }),
  tbsQuantity: decimal("tbs_quantity", { precision: 10, scale: 2 }),
  kgQuantity: decimal("kg_quantity", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 15, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  isTaxable: boolean("is_taxable").default(false).notNull(),
  taxPercentage: decimal("tax_percentage", { precision: 5, scale: 2 }).default(11.00).notNull(),
  taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).default(0).notNull(),
  saleDate: date("sale_date").notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerAddress: text("customer_address"),
  salesProofPath: varchar("sales_proof_path", { length: 500 }),
  createdByUserId: varchar("created_by_user_id", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});