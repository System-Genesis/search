/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { DigitalIdentityFilters } from '../express/digitalIdentity/textSearchInterface';
import { EntityFilters, entityMapFieldType } from '../express/entity/textSearchInterface';
import { GroupFilters } from '../express/group/textSearchInterface';
import { RoleFilters } from '../express/role/textSearchInterface';
import { RuleFilter, FilterQueries } from '../types';

export const extractEntityFiltersQuery = (filtersQuery: RuleFilter[], userQuery: RuleFilter[]): FilterQueries<Partial<EntityFilters>> => {
    let filters: Partial<EntityFilters> = {};
    let mustNotFilters: Partial<EntityFilters> = {};
    for (const filterRule of filtersQuery) {
        mustNotFilters[entityMapFieldType[filterRule.field][filterRule.entityType]] = (
            mustNotFilters[entityMapFieldType[filterRule.field][filterRule.entityType]] as []
        ).concat(filterRule.values as []);
    }
    for (const filterRule of userQuery) {
        filters[entityMapFieldType[filterRule.field][filterRule.entityType]] = (
            filters[entityMapFieldType[filterRule.field][filterRule.entityType]] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters: filters, ruleFilters: mustNotFilters } as FilterQueries<Partial<EntityFilters>>;
};

export const extractGroupFiltersQuery = (filtersQuery: any): Partial<GroupFilters> => {
    let filters: Partial<GroupFilters> = {};
    for (const [key, value] of Object.entries(filtersQuery)) {
        filters[key] = value;
    }
    return filters;
};

export const extractDIFiltersQuery = (filtersQuery: any): Partial<DigitalIdentityFilters> => {
    let filters: Partial<DigitalIdentityFilters> = {};
    for (const [key, value] of Object.entries(filtersQuery)) {
        filters[key] = value;
    }
    return filters;
};

export const extractRoleFiltersQuery = (filtersQuery: any): Partial<RoleFilters> => {
    let filters: Partial<RoleFilters> = {};
    for (const [key, value] of Object.entries(filtersQuery)) {
        filters[key] = value;
    }
    return filters;
};

export default { extractEntityFiltersQuery, extractGroupFiltersQuery };
