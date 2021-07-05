/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { DigitalIdentityFilters } from '../express/digitalIdentity/textSearchInterface';
import { EntityFilters } from '../express/entity/textSearchInterface';
import { GroupFilters } from '../express/group/textSearchInterface';

export const extractEntityFiltersQuery = (filtersQuery: any): Partial<EntityFilters> => {
    let filters: Partial<EntityFilters> = {};
    for (const [key, value] of Object.entries(filtersQuery)) {
        if (key === 'source') {
            filters['digitalIdentities.source'] = value as string;
        } else {
            filters[key] = value;
        }
    }
    return filters;
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

export default { extractEntityFiltersQuery, extractGroupFiltersQuery };
