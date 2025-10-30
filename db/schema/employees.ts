import { pgTable, serial, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { masterEmployeeDepartments } from "./master";
import { masterEmployeePositions } from "./master";
import { masterEmployeeGroups } from "./master";

// Data Karyawan
export const dataKaryawan = pgTable("data_karyawan", {
  id: serial("id").primaryKey(),
  ndp: varchar("ndp", { length: 20 }).notNull().unique(),
  nama: varchar("nama", { length: 255 }).notNull(),
  departmentId: integer("department_id").references(() => masterEmployeeDepartments.id, { onDelete: "set null" }),
  positionId: integer("position_id").references(() => masterEmployeePositions.id, { onDelete: "set null" }),
  groupId: integer("group_id").references(() => masterEmployeeGroups.id, { onDelete: "set null" }),
  gajiBulanan: decimal("gaji_bulanan", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull().default("Aktif"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});