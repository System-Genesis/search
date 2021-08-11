import { FilterQueries } from '../../types';
import { IOrganizationGroup } from './interface';

export type GroupQuery = {
    name: string;
    hierarchy: string;
};

export type GroupFilters = {
    underGroupId: string[];
    status: [];
    isAlive: boolean[];
};

export const groupMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['underGroupId', new Map<string, string>([['group', 'underGroupId']])],
    ['status', new Map<string, string>([['group', 'status']])],
    ['isAlive', new Map<string, string>([['group', 'isAlive']])],
]);

export interface OrganizationGroupTextSearch {
    searchByNameAndHierarchy(
        nameAndHierarchyQuery: Partial<GroupQuery>,
        filters?: FilterQueries<Partial<GroupFilters>>,
    ): Promise<IOrganizationGroup[]>;
}
