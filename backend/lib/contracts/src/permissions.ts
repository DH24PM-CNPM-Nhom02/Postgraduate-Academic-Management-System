export const PERMISSIONS = {
    USER_READ: 'user.read',
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    ROLE_READ: 'role.read',
    ROLE_UPDATE: 'role.update',

    MILESTONE_READ: 'milestone.read',
    MILESTONE_SUBMIT: 'milestone.submit',
    MILESTONE_APPROVE: 'milestone.approve',
    MILESTONE_REJECT: 'milestone.reject',

    QUOTA_READ: 'quota.read',
    QUOTA_UPDATE: 'quota.update',
    THESIS_CHANGE_CREATE: 'thesis_change.create',
    THESIS_CHANGE_APPROVE: 'thesis_change.approve',
    GRADUATION_CHECK: 'graduation.check',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const ROLES = { ADMIN: 'ADMIN', GIAO_VU: 'GIAO_VU', GVHD: 'GVHD', NCS: 'NCS' } as const;