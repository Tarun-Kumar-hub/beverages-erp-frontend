// constants/roles.js

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
};

export const ALL_USERS = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF];

export const MANAGEMENT = [ROLES.ADMIN, ROLES.MANAGER];

export const ADMIN_ONLY = [ROLES.ADMIN];
