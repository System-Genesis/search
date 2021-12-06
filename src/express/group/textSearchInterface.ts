import { FilterQueries } from '../../types';
import { IOrganizationGroup } from './interface';

export type GroupQuery = {
    name: string;
    hierarchy: string;
    nameAndHierarchy: string;
};

export type GroupFilters = {
    underGroupId: string[];
    status: [];
    expanded: boolean[];
    isAlive: boolean[];
    source: string[];
};

export const groupMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['underGroupId', new Map<string, string>([['group', 'underGroupId']])],
    ['status', new Map<string, string>([['group', 'status']])],
    ['isAlive', new Map<string, string>([['group', 'isAlive']])],
    ['expanded', new Map<string, string>([['group', 'expanded']])],
    ['source', new Map<string, string>([['group', 'source']])],
]);

export interface OrganizationGroupTextSearch {
    searchByNameAndHierarchy(
        nameAndHierarchyQuery: Partial<GroupQuery>,
        filters?: FilterQueries<Partial<GroupFilters>>,
    ): Promise<IOrganizationGroup[]>;
}
