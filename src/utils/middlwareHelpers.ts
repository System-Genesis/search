import { EntityFilters } from '../express/entity/textSearchInterface';

export const extractEntityFiltersQuery = (filtersQuery: any) => {
    // eslint-disable-next-line prefer-const
    let filters: Partial<EntityFilters> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filtersQuery)) {
        if (key === 'source') {
            filters['digitalIdentities.source'] = value as string;
        } else {
            filters[key] = value;
        }
    }
    return filters;
};

export default { extractEntityFiltersQuery };
