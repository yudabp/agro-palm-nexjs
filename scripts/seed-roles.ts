import { db } from "../db";
import { user, userRoles, userRoleAssignments } from "../db/schema";
import { eq } from "drizzle-orm";

async function seedRoles() {
  console.log("🌱 Starting role assignment seeding...");

  try {
    // Get the Superadmin role
    const [superadminRole] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.name, "Superadmin"))
      .limit(1);

    if (!superadminRole) {
      console.error("❌ Superadmin role not found. Please run the main seed script first.");
      process.exit(1);
    }

    // Check if there are any users
    const users = await db.select().from(user).limit(1);

    if (users.length === 0) {
      console.log("ℹ️ No users found. Please register a user first, then run this script again.");
      console.log("   You can register at: http://localhost:3001/sign-up");
      process.exit(0);
    }

    // Assign Superadmin role to the first user (or update existing)
    const firstUser = users[0];

    // Deactivate any existing role assignments for this user
    await db
      .update(userRoleAssignments)
      .set({ isActive: false })
      .where(eq(userRoleAssignments.userId, firstUser.id));

    // Create new role assignment
    await db.insert(userRoleAssignments).values({
      userId: firstUser.id,
      roleId: superadminRole.id,
      assignedBy: firstUser.id, // Self-assigned for first admin
      isActive: true,
      assignedAt: new Date(),
    });

    console.log(`✅ Superadmin role assigned to user: ${firstUser.name} (${firstUser.email})`);
    console.log("   You can now log in with this account and manage other users' roles.");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    process.exit(1);
  }
}

seedRoles().then(() => {
  console.log("🎉 Role seeding process finished!");
  process.exit(0);
});