/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { DigitalIdentityFilters } from '../express/digitalIdentity/textSearchInterface';
import { EntityFilters, entityMapFieldType } from '../express/entity/textSearchInterface';
import { GroupFilters, groupMapFieldType } from '../express/group/textSearchInterface';
import { RoleFilters, roleMapFieldType } from '../express/role/textSearchInterface';
import { RuleFilter, FilterQueries } from '../types';

export const filterMustNotArr = (array: string[]): string[] => {
    const newArr: string[] = array.filter((element) => element.startsWith('!'));
    const newArrWithoutNot: string[] = newArr.map((element) => element.slice(1));
    return newArrWithoutNot;
};
export const filterMustArr = (array: string[]): string[] => {
    const newArr: string[] = array.filter((element) => !element.startsWith('!'));
    const newArrWithoutNot: string[] = newArr.map((element) => element.slice(1));
    return newArrWithoutNot;
};

export const extractEntityFiltersQuery = (filtersQuery: RuleFilter[] = [], userQuery: RuleFilter[] = []): FilterQueries<Partial<EntityFilters>> => {
    let userFilters: Partial<EntityFilters> = {};
    let mustNotFilters: Partial<EntityFilters> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    console.log((<RuleFilter[]>filtersQuery)[0]);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        if (userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters, ruleFilters: mustNotFilters } as FilterQueries<Partial<EntityFilters>>;
};

export const extractGroupFiltersQuery = (filtersQuery: RuleFilter[] = [], userQuery: RuleFilter[] = []): FilterQueries<Partial<GroupFilters>> => {
    let userFilters: Partial<GroupFilters> = {};
    let mustNotFilters: Partial<GroupFilters> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        if (userFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            userFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        userFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            userFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters, ruleFilters: mustNotFilters } as FilterQueries<Partial<GroupFilters>>;
};

export const extractDIFiltersQuery = (
    filtersQuery: RuleFilter[] = [],
    userQuery: RuleFilter[] = [],
): FilterQueries<Partial<DigitalIdentityFilters>> => {
    let userFilters: Partial<DigitalIdentityFilters> = {};
    let mustNotFilters: Partial<DigitalIdentityFilters> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        if (userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            userFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters, ruleFilters: mustNotFilters } as FilterQueries<Partial<DigitalIdentityFilters>>;
};

export const extractRoleFiltersQuery = (filtersQuery: RuleFilter[] = [], userQuery: RuleFilter[] = []): FilterQueries<Partial<RoleFilters>> => {
    let userFilters: Partial<RoleFilters> = {};
    let mustNotFilters: Partial<RoleFilters> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        if (userFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            userFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        userFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            userFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters, ruleFilters: mustNotFilters } as FilterQueries<Partial<RoleFilters>>;
};

export default { extractEntityFiltersQuery, extractGroupFiltersQuery };
