import { FilterQueries } from '../../utils/types';
import { IOrganizationGroup } from './interface';

export type GroupQuery = {
    name: string;
    hierarchy: string;
    nameAndHierarchy: string;
};

export type GroupFilters = {
    underGroupId: string[];
    isAlive: boolean[];
    status: string[];
    expanded: boolean[];
    source: string[];
};

export const groupMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['underGroupId', new Map<string, string>([['group', 'underGroupId']])],
    ['status', new Map<string, string>([['group', 'status']])],
    ['expanded', new Map<string, string>([['group', 'expanded']])],
    ['source', new Map<string, string>([['group', 'source']])],
]);

// TODO (RN) - perhaps extract the following interface to a repo interface that doesn't depend on elastic
export interface OrganizationGroupTextSearch {
    searchByNameAndHierarchy(
        nameAndHierarchyQuery: Partial<GroupQuery>,
        filters: FilterQueries<Partial<GroupFilters>>,
    ): Promise<IOrganizationGroup[]>;
}
