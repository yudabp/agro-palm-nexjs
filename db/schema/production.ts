import { pgTable, serial, varchar, date, integer, decimal, text, timestamp } from "drizzle-orm/pg-core";
import { masterVehicles } from "./master";
import { masterAfdelings } from "./master";
import { masterPks } from "./master";
import { user } from "./auth";

// Data Produksi
export const dataProduksi = pgTable("data_produksi", {
  id: serial("id").primaryKey(),
  noSp: varchar("no_sp", { length: 50 }).notNull().unique(),
  tanggal: date("tanggal").notNull(),
  vehicleId: integer("vehicle_id").references(() => masterVehicles.id, { onDelete: "set null" }),
  jumlahTbs: integer("jumlah_tbs").notNull(),
  jumlahKg: decimal("jumlah_kg", { precision: 10, scale: 2 }).notNull(),
  afdelingId: integer("afdeling_id").references(() => masterAfdelings.id, { onDelete: "set null" }),
  pksId: integer("pks_id").references(() => masterPks.id, { onDelete: "set null" }),
  fotoUrls: text("foto_urls"), // JSON array of file paths
  createdByUserId: varchar("created_by_user_id", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});