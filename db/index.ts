import { drizzle } from 'drizzle-orm/node-postgres';

// Import individual schemas to avoid circular dependencies
import * as authSchema from './schema/auth';
import * as rolesSchema from './schema/roles';
import * as masterSchema from './schema/master';
import * as productionSchema from './schema/production';
import * as salesSchema from './schema/sales';
import * as employeesSchema from './schema/employees';
import * as financialSchema from './schema/financial';
import * as relationsSchema from './schema/relations';

// Combine all schemas
const schema = {
  ...authSchema,
  ...rolesSchema,
  ...masterSchema,
  ...productionSchema,
  ...salesSchema,
  ...employeesSchema,
  ...financialSchema,
  ...relationsSchema,
};

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// Export all schemas for convenience
export * from './schema/auth';
export * from './schema/roles';
export * from './schema/master';
export * from './schema/production';
export * from './schema/sales';
export * from './schema/employees';
export * from './schema/financial';
export * from './schema/relations';
export { schema };