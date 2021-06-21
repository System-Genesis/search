export interface IRole {
    roleId?: string;
    jobTitle: string;
    digitalIdentityUniqueId: string;
    directGroup: string;
    hierarchy: string;
    hierarchyIds: string[];
    source: string;
    createdAt: Date;
    updatedAt: Date;
}
