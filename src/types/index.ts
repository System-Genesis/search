/* eslint-disable no-restricted-syntax */
export type RuleFilter = {
    field: string;
    values: string[];
    entityType: string;
};

export type FilterQueries<T> = {
    userFilters: T;
    ruleFilters: T;
};

export function extractFiltersQuery<T>(
    filtersQuery: RuleFilter[] = [],
    userQuery: RuleFilter[] = [],
    mapFieldType: Map<string, Map<string, string>>,
) {
    const userFilters: Partial<T> = {};
    const mustNotFilters: Partial<T> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        if (userFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            userFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        userFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            userFilters[mapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters, ruleFilters: mustNotFilters } as FilterQueries<Partial<T>>;
}
