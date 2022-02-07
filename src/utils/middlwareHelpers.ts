/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import config from '../config';
import { RuleFilter, FilterQueries } from './types';

const keysToSplit = ['rank', 'source', 'digitalIdentity.source', 'entityType', 'type', 'akaUnit', 'jobTitle'];

export const filterMustNotArr = (array: any[]): any[] => {
    const newArr: any[] = array.filter((element) => (element as any).toString().startsWith('!'));
    const newArrWithoutNot: any[] = newArr.map((element) => element.slice(1));
    return newArrWithoutNot;
};
export const filterMustArr = (array: any[]): any[] => {
    const newArr: any[] = array.filter((element) => !(element as any).toString().startsWith('!'));
    return newArr;
};

export function splitQueryValue(value: any) {
    const result = !Array.isArray(value) ? value?.split(',') : value;
    return result;
}

/**
 * This functions the all the query keys which the client wishes to filter and transforms it to user filters object.
 * Also, it splits the values if they have commas, and takes care of the aliases.
 * @example example: { rank: 'unknown',digitalIdentities.source: 'es_name'}
 * @param query All the user filters keys to transform to user filters object.
 * @returns The user filter object
 */
export function transformQueryToUserFilters<T>(query: any = {}): Partial<T> {
    let userFilters: Partial<T> = {};
    for (let key in query) {
        if (keysToSplit.includes(key)) {
            query[key] = splitQueryValue(query[key]);
        }
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
            let aliasSource = key === 'source' ? config.aliases.di : config.aliases.entity;
            let allSources: string[] = [];
            for (const element of query[key]) {
                if (aliasSource.hasOwnProperty((element as string).toLowerCase())) {
                    allSources = allSources.concat(aliasSource[element.toLowerCase()] as []);
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

/**
 * @example {filtersQuery: {hierarchy: 'מדור שכיבת סמיכה/צוות בראשית'}, userQuery: 'expanded':true, ,mapRuleFieldType: exported from textSearchInterface dir}
 * @param filtersQuery  The rule filters from gate, to not show the filter the results you must`nt show the client.
 * @param userQuery The user filters from the client.
 * @param mapRuleFieldType Map fields for rule filters that belongs to the model.
 * @returns The FilterQueries type with rule filters and user filters, for the current model.
 */
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

    return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<T>>;
}

export default { extractFiltersQuery };
