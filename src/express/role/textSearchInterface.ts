import { IRole } from './interface';

export type RoleFilters = {
    jobTitle: string | string[];
    hierarchy: string | string[];
    source: string | string[];
};

export interface RoleTextSearch {
    searchByFullName(roleId: string, filters?: Partial<RoleFilters>): Promise<IRole[]>;
}
