import { db } from "../db";
import { userRoles, masterVehicles, masterAfdelings, masterPks, masterEmployeeDepartments, masterEmployeePositions, masterEmployeeGroups, masterDebtTypes, masterBkkExpenseCategories } from "../db/schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Insert User Roles
    console.log("📋 Inserting user roles...");
    await db.insert(userRoles).values([
      {
        name: "Direksi",
        description: "Direksi - Read-only and Export access",
        permissions: '{"read":true,"export":true,"write":false,"delete":false,"manageUsers":false}',
      },
      {
        name: "Superadmin",
        description: "Superadmin - Full Access",
        permissions: '{"read":true,"export":true,"write":true,"delete":true,"manageUsers":true}',
      },
    ]);

    // Insert Master Vehicles
    console.log("🚛 Inserting master vehicles...");
    await db.insert(masterVehicles).values([
      { noPol: "BK 1234 AB" },
      { noPol: "BK 5678 CD" },
      { noPol: "BK 9012 EF" },
    ]);

    // Insert Master Afdelings
    console.log("🏞️ Inserting master afdelings...");
    await db.insert(masterAfdelings).values([
      { name: "Afdeling 1", description: "Area perkebunan bagian utara" },
      { name: "Afdeling 2", description: "Area perkebunan bagian selatan" },
      { name: "Afdeling 3", description: "Area perkebunan bagian timur" },
    ]);

    // Insert Master PKS
    console.log("🏭 Inserting master PKS...");
    await db.insert(masterPks).values([
      {
        name: "PKS Mitra Sejati",
        address: "Jl. Industri No. 123, Medan",
        phone: "061-1234567"
      },
      {
        name: "PKS Sawit Jaya",
        address: "Jl. Kelapa No. 456, Pekanbaru",
        phone: "0761-987654"
      },
    ]);

    // Insert Master Employee Departments
    console.log("👥 Inserting employee departments...");
    await db.insert(masterEmployeeDepartments).values([
      { name: "Staff", description: "Karyawan staf administrasi" },
      { name: "Pegawai", description: "Karyawan lapangan" },
      { name: "Manajerial", description: "Karyawan manajerial" },
    ]);

    // Insert Master Employee Positions
    console.log("💼 Inserting employee positions...");
    await db.insert(masterEmployeePositions).values([
      { name: "Direktur", level: "Executive" },
      { name: "Manager", level: "Management" },
      { name: "Supervisor", level: "Supervisor" },
      { name: "Staff", level: "Staff" },
      { name: "Mandor", level: "Field Leader" },
      { name: "Pekerja", level: "Labor" },
    ]);

    // Insert Master Employee Groups
    console.log("👨‍👩‍👧‍👦 Inserting employee groups...");
    await db.insert(masterEmployeeGroups).values([
      { name: "Karyawan Tetap", description: "Karyawan dengan status tetap" },
      { name: "Karyawan Kontrak", description: "Karyawan dengan status kontrak" },
      { name: "Karyawan Harian", description: "Karyawan harian lepas" },
    ]);

    // Insert Master Debt Types
    console.log("💳 Inserting debt types...");
    await db.insert(masterDebtTypes).values([
      { name: "Susu Tunggakan", description: "Hutang susu karyawan" },
      { name: "Investor", description: "Hutang kepada investor" },
      { name: "Operasional", description: "Hutang biaya operasional" },
      { name: "Modal Kerja", description: "Hutang untuk modal kerja" },
    ]);

    // Insert Master BKK Expense Categories
    console.log("💰 Inserting BKK expense categories...");
    await db.insert(masterBkkExpenseCategories).values([
      { name: "Gaji", description: "Penggajian karyawan" },
      { name: "Hutang", description: "Pelunasan hutang karyawan" },
      { name: "Operasional", description: "Biaya operasional harian" },
      { name: "Maintenance", description: "Biaya perawatan alat" },
      { name: "Transportasi", description: "Biaya transportasi" },
      { name: " ATK", description: "Alat tulis kantor" },
      { name: "Lain-lain", description: "Pengeluaran lainnya" },
    ]);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed().then(() => {
  console.log("🎉 Seeding process finished!");
  process.exit(0);
});