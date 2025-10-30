import { relations } from "drizzle-orm";
import { user, session, account, verification } from "./auth";
import { userRoles, userRoleAssignments } from "./roles";
import { masterVehicles, masterAfdelings, masterPks, masterEmployeeDepartments, masterEmployeePositions, masterEmployeeGroups, masterDebtTypes, masterBkkExpenseCategories } from "./master";
import { dataProduksi } from "./production";
import { dataPenjualan } from "./sales";
import { dataKaryawan } from "./employees";
import { keuanganPerusahaan, bukuKasKebun, dataHutang, hutangPembayaran } from "./financial";

// Auth relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  verifications: many(verification),
  roleAssignments: many(userRoleAssignments),
  assignedRoles: many(userRoleAssignments),
  produksiCreated: many(dataProduksi),
  penjualanCreated: many(dataPenjualan),
  kpCreated: many(keuanganPerusahaan),
  bkkCreated: many(bukuKasKebun),
  hutangCreated: many(dataHutang),
}));

// Role relations
export const userRolesRelations = relations(userRoles, ({ many }) => ({
  assignments: many(userRoleAssignments),
}));

export const userRoleAssignmentsRelations = relations(userRoleAssignments, ({ one }) => ({
  user: one(user, {
    fields: [userRoleAssignments.userId],
    references: [user.id],
  }),
  role: one(userRoles, {
    fields: [userRoleAssignments.roleId],
    references: [userRoles.id],
  }),
  assignedByUser: one(user, {
    fields: [userRoleAssignments.assignedBy],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(user, {
    fields: [verification.identifier],
    references: [user.email],
  }),
}));

// Master tables relations (typically one-to-many)
export const masterVehicleRelations = relations(masterVehicles, ({ many }) => ({
  produksi: many(dataProduksi),
}));

export const masterAfdelingRelations = relations(masterAfdelings, ({ many }) => ({
  produksi: many(dataProduksi),
}));

export const masterPksRelations = relations(masterPks, ({ many }) => ({
  produksi: many(dataProduksi),
}));

export const masterEmployeeDepartmentRelations = relations(masterEmployeeDepartments, ({ many }) => ({
  karyawan: many(dataKaryawan),
}));

export const masterEmployeePositionRelations = relations(masterEmployeePositions, ({ many }) => ({
  karyawan: many(dataKaryawan),
}));

export const masterEmployeeGroupRelations = relations(masterEmployeeGroups, ({ many }) => ({
  karyawan: many(dataKaryawan),
}));

export const masterDebtTypeRelations = relations(masterDebtTypes, ({ many }) => ({
  hutang: many(dataHutang),
}));

export const masterBkkExpenseCategoryRelations = relations(masterBkkExpenseCategories, ({ many }) => ({
  bkk: many(bukuKasKebun),
}));

// Production relations
export const dataProduksiRelations = relations(dataProduksi, ({ one, many }) => ({
  vehicle: one(masterVehicles, {
    fields: [dataProduksi.vehicleId],
    references: [masterVehicles.id],
  }),
  afdeling: one(masterAfdelings, {
    fields: [dataProduksi.afdelingId],
    references: [masterAfdelings.id],
  }),
  pks: one(masterPks, {
    fields: [dataProduksi.pksId],
    references: [masterPks.id],
  }),
  createdByUser: one(user, {
    fields: [dataProduksi.createdByUserId],
    references: [user.id],
  }),
  penjualan: many(dataPenjualan),
}));

// Sales relations
export const dataPenjualanRelations = relations(dataPenjualan, ({ one }) => ({
  produksi: one(dataProduksi, {
    fields: [dataPenjualan.produksiId],
    references: [dataProduksi.id],
  }),
  createdByUser: one(user, {
    fields: [dataPenjualan.createdByUserId],
    references: [user.id],
  }),
}));

// Employee relations
export const dataKaryawanRelations = relations(dataKaryawan, ({ one }) => ({
  department: one(masterEmployeeDepartments, {
    fields: [dataKaryawan.departmentId],
    references: [masterEmployeeDepartments.id],
  }),
  position: one(masterEmployeePositions, {
    fields: [dataKaryawan.positionId],
    references: [masterEmployeePositions.id],
  }),
  group: one(masterEmployeeGroups, {
    fields: [dataKaryawan.groupId],
    references: [masterEmployeeGroups.id],
  }),
}));

// Financial relations
export const keuanganPerusahaanRelations = relations(keuanganPerusahaan, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [keuanganPerusahaan.createdByUserId],
    references: [user.id],
  }),
  bkkTransactions: many(bukuKasKebun),
}));

export const bukuKasKebunRelations = relations(bukuKasKebun, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [bukuKasKebun.createdByUserId],
    references: [user.id],
  }),
  kpTransaction: one(keuanganPerusahaan, {
    fields: [bukuKasKebun.kpId],
    references: [keuanganPerusahaan.id],
  }),
  expenseCategory: one(masterBkkExpenseCategories, {
    fields: [bukuKasKebun.expenseCategoryId],
    references: [masterBkkExpenseCategories.id],
  }),
  hutangPembayaran: many(hutangPembayaran),
}));

export const dataHutangRelations = relations(dataHutang, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [dataHutang.createdByUserId],
    references: [user.id],
  }),
  debtType: one(masterDebtTypes, {
    fields: [dataHutang.debtTypeId],
    references: [masterDebtTypes.id],
  }),
  pembayaran: many(hutangPembayaran),
}));

export const hutangPembayaranRelations = relations(hutangPembayaran, ({ one }) => ({
  hutang: one(dataHutang, {
    fields: [hutangPembayaran.hutangId],
    references: [dataHutang.id],
  }),
  bkk: one(bukuKasKebun, {
    fields: [hutangPembayaran.bkkId],
    references: [bukuKasKebun.id],
  }),
}));