import { FilterQueries } from '../../types';
import { IRole } from './interface';

export type RoleFilters = {
    jobTitle: string[];
    hierarchy: string[];
    source: string[];
    directGroup: string[];
};

export interface RoleTextSearch {
    searchByFullName(roleId: string, filters?: FilterQueries<Partial<RoleFilters>>): Promise<IRole[]>;
}
export const roleMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['jobTitle', new Map<string, string>([['role', 'jobTitle']])],

    ['hierarchy', new Map<string, string>([['role', 'hierarchy']])],
    ['source', new Map<string, string>([['role', 'source']])],
    ['directGroup', new Map<string, string>([['role', 'directGroup']])],
]);
