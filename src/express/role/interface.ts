export interface IRole {
    roleId: string;
    jobTitle: string;
    clearance: string;
    digitalIdentityUniqueId: string;
    directGroup: string;
    hierarchy: string;
    hierarchyIds: string[];
    createdAt: Date;
    updatedAt: Date;
    source: string;
}
