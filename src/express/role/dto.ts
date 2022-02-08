export interface RoleDTO {
    roleId: string;
    jobTitle: string;
    digitalIdentityUniqueId: string;
    directGroup: string;
    clearance: string;
    hierarchy: string;
    hierarchyIds: string[];
    createdAt: Date;
    updatedAt: Date;
    source: string;
}
