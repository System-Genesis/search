export type RuleFilter = {
    field: string;
    values: string[];
    entityType: string;
};

export type FilterQueries<T> = {
    userFilters: Partial<T>;
    ruleFilters: Partial<T>;
};
