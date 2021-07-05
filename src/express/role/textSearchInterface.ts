import { IRole } from './interface';

export type RoleFilters = {
    jobTitle: string;
    hierarchy: string;
    source: string;
};

export interface RoleTextSearch {
    searchByFullName(roleId: string, filters?: Partial<RoleFilters>): Promise<IRole[]>;
}
