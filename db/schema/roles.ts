import { pgTable, serial, varchar, timestamp, text, boolean, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

// User Roles table
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(), // Direksi, Superadmin
  description: text("description"),
  permissions: text("permissions"), // JSON string of permissions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User role assignments
export const userRoleAssignments = pgTable("user_role_assignments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => userRoles.id, { onDelete: "cascade" }),
  assignedBy: text("assigned_by").references(() => user.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});