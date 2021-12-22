/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import config from '../config';
import { RuleFilter, FilterQueries } from '../types';

export const filterMustNotArr = (array: any[]): any[] => {
    const newArr: any[] = array.filter((element) => (element as any).toString().startsWith('!'));
    const newArrWithoutNot: any[] = newArr.map((element) => element.slice(1));
    return newArrWithoutNot;
};
export const filterMustArr = (array: any[]): any[] => {
    const newArr: any[] = array.filter((element) => !(element as any).toString().startsWith('!'));
    return newArr;
};
export function transformQueryToUserFilters<T>(query: any = {}): Partial<T> {
    let userFilters: Partial<T> = {};
    // let obj: ExcludedTypes<T, T> = deepCopy(query as T);
    for (let key in query) {
        if (key === 'expanded') {
            if (Array.isArray(query[key])) {
                userFilters[key] = (query[key] as []).map((element) => (element as string).toString() === 'true') as never;
            } else {
                userFilters[key] = [(query[key] as string).toString() === 'true'] as never;
            }
        } else if (key === 'digitalIdentity.source' || key === 'source') {
            if (!Array.isArray(query[key])) {
                query[key] = [query[key]];
            }
            let allSources: string[] = [];
            for (const element of query[key]) {
                if (config.aliases.hasOwnProperty((element as string).toLowerCase())) {
                    allSources = allSources.concat(config.aliases[element.toLowerCase()] as []);
                } else {
                    allSources.push(element);
                }
            }
            userFilters[key === 'digitalIdentity.source' ? 'digitalIdentities.source' : key] = allSources;
        } else {
            userFilters[key] = Array.isArray(query[key]) ? query[key] : [query[key]];
        }
    }
    return userFilters;
}

export function extractFiltersQuery<T>(
    filtersQuery: RuleFilter[] = [],
    userQuery: Partial<T> = {},
    mapRuleFieldType: Map<string, Map<string, string>>,
): FilterQueries<Partial<T>> {
    let mustNotFilters: Partial<T> = {};
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[mapRuleFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[mapRuleFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[mapRuleFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[mapRuleFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }

    return { userFilters: userQuery, ruleFilters: mustNotFilters };
}

// export const extractEntityFiltersQuery = (
//     filtersQuery: RuleFilter[] = [],
//     userQuery: Partial<EntityFilters> = {},
// ): FilterQueries<Partial<EntityFilters>> => {
//     let mustNotFilters: Partial<EntityFilters> = {};
//     for (const filterRule of filtersQuery) {
//         if (mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
//             mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
//         }
//         mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
//             mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
//         ).concat(filterRule.values as []);
//     }

//     return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<EntityFilters>>;
// };

// export const extractGroupFiltersQuery = (
//     filtersQuery: RuleFilter[] = [],
//     userQuery: Partial<GroupFilters> = {},
// ): FilterQueries<Partial<GroupFilters>> => {
//     let mustNotFilters: Partial<GroupFilters> = {};
//     for (const filterRule of filtersQuery) {
//         if (mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
//             mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
//         }
//         mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
//             mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
//         ).concat(filterRule.values as []);
//     }
//     return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<GroupFilters>>;
// };

// export const extractDIFiltersQuery = (
//     filtersQuery: RuleFilter[] = [],
//     userQuery: Partial<DigitalIdentityFilters> = {},
// ): FilterQueries<Partial<DigitalIdentityFilters>> => {
//     let mustNotFilters: Partial<DigitalIdentityFilters> = {};
//     // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
//     // filtersQuery.push(rule);
//     for (const filterRule of filtersQuery) {
//         if (mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
//             mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
//         }
//         mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
//             mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
//         ).concat(filterRule.values as []);
//     }

//     return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<DigitalIdentityFilters>>;
// };

// export const extractRoleFiltersQuery = (
//     filtersQuery: RuleFilter[] = [],
//     userQuery: Partial<RoleFilters> = {},
// ): FilterQueries<Partial<RoleFilters>> => {
//     let mustNotFilters: Partial<RoleFilters> = {};
//     for (const filterRule of filtersQuery) {
//         if (mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
//             mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
//         }
//         mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
//             mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
//         ).concat(filterRule.values as []);
//     }

//     return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<RoleFilters>>;
// };

export default { extractFiltersQuery };
