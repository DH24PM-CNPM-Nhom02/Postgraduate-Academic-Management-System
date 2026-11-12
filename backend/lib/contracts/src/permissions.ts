export const PERMISSIONS = {
    USER_READ: 'user.read',
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    USER_RESET_PASSWORD: 'user.reset_password',
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

    NCS_READ: 'ncs.read',
    NCS_CREATE: 'ncs.create',
    NCS_UPDATE: 'ncs.update',

    GVHD_READ: 'gvhd.read',
    GVHD_CREATE: 'gvhd.create',
    GVHD_UPDATE: 'gvhd.update',

    DOCUMENT_UPLOAD: 'document.upload',
    DOCUMENT_READ: 'document.read',
    DOCUMENT_DELETE: 'document.delete',

    DECISION_READ: 'decision.read',
    DECISION_CREATE: 'decision.create',
    DECISION_UPDATE: 'decision.update',

    ASSIGNMENT_READ: 'assignment.read',
    ASSIGNMENT_CREATE: 'assignment.create',
    ASSIGNMENT_UPDATE: 'assignment.update',

    CHANGE_REQUEST_CREATE: 'changerequest.create',
    CHANGE_REQUEST_READ: 'changerequest.read',
    CHANGE_REQUEST_REVIEW: 'changerequest.review',
    CHANGE_REQUEST_SUPERVISOR_REVIEW: 'changerequest.supervisor_review',
    CHANGE_REQUEST_CANCEL: 'changerequest.cancel',

    AUDIT_READ: 'audit.read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const ROLES = { ADMIN: 'ADMIN', GIAO_VU: 'GIAO_VU', GVHD: 'GVHD', NCS: 'NCS' } as const;