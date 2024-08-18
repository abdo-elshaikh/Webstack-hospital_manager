const ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user',
}

const PERMISSIONS = {
    READ: 'read',
    WRITE: 'write',
    UPDATE: 'update',
    DELETE: 'delete',
}

const getPermissions = (role) => {
    switch (role) {
        case ROLES.ADMIN:
            return [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE]
        case ROLES.STAFF:
            return [PERMISSIONS.READ, PERMISSIONS.UPDATE]
        case ROLES.USER:
            return [PERMISSIONS.READ]
        default:
            return []
    }
}

export { ROLES, PERMISSIONS, getPermissions }