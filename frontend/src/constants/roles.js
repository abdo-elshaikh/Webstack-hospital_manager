export const ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user',
};

export const PERMISSIONS = {
    ADMIN: [ROLES.ADMIN],
    STAFF: [ROLES.ADMIN, ROLES.STAFF],
    USER: [ROLES.ADMIN, ROLES.STAFF, ROLES.USER],
};

