/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { DigitalIdentityFilters, digitalIdentityMapFieldType } from '../express/digitalIdentity/textSearchInterface';
import { EntityFilters, entityMapFieldType } from '../express/entity/textSearchInterface';
import { GroupFilters, groupMapFieldType } from '../express/group/textSearchInterface';
import { RoleFilters, roleMapFieldType } from '../express/role/textSearchInterface';
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
// type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
// type TypeOf<T> = T extends boolean ? 'boolean' : T extends string ? 'string' : T extends number ? 'number' : 'object' | (new (...args: any[]) => T);

// function getFields<T>(fields: { [P in NonMethodKeys<T>]: TypeOf<T[P]> }): typeof fields {
//     return fields;
// }
// function isKey<E>(_str: string | number | symbol): _str is keyof E {
//     return true;
// }
// type PossibleKeys = 'foo' | 'bar';
// type NonFunctionPropertyNames<T> = {
//     [K in keyof T]: T[K] extends Function ? never : K;
// }[keyof T];
// type StringKeys<T> = Extract<keyof T, any>;

// type Exactly<T, U> = T & Record<Exclude<keyof U, keyof T>, never>;

// function pick<T>(obj: T, keys: keyof T): any {
//     return obj[keys];
// }

// const asValidObject = <T extends Partial<NonFunctionPropertyNames<T>>>(t: T) => t;
// type ExcludedTypes<T, U> = {
//     [K in Extract<keyof T, keyof U>]: T[K];
// };

// function showType<T>(args: ExcludedTypes<T, T>) {
//     console.log(args);
// }
// function deepCopy<T>(obj) {
//     let copy: T = { ...obj };

//     // Handle Object

//     for (let attr in obj) {
//         // eslint-disable-next-line no-prototype-builtins
//         if ((obj as Object).hasOwnProperty(attr)) copy[attr] = obj[attr];
//     }
//     return copy;
// }
// function foo<T extends Partial<T>, K extends keyof T>(source: T, value: T[K], property: K) {
//     // eslint-disable-next-line no-param-reassign
//     source[property] = value;
// }
// function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
//     return o[propertyName]; // o[propertyName] is of type T[K]
// }

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
        } else {
            userFilters[key] = Array.isArray(query[key]) ? query[key] : [query[key]];
        }
    }
    return userFilters;
}

export const extractEntityFiltersQuery = (
    filtersQuery: RuleFilter[] = [],
    userQuery: Partial<EntityFilters> = {},
): FilterQueries<Partial<EntityFilters>> => {
    let mustNotFilters: Partial<EntityFilters> = {};
    console.log((<RuleFilter[]>filtersQuery)[0]);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[entityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }

    return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<EntityFilters>>;
};

export const extractGroupFiltersQuery = (
    filtersQuery: RuleFilter[] = [],
    userQuery: Partial<GroupFilters> = {},
): FilterQueries<Partial<GroupFilters>> => {
    let mustNotFilters: Partial<GroupFilters> = {};
    console.log((<RuleFilter[]>filtersQuery)[0]);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[groupMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }
    return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<GroupFilters>>;
};

export const extractDIFiltersQuery = (
    filtersQuery: RuleFilter[] = [],
    userQuery: Partial<DigitalIdentityFilters> = {},
): FilterQueries<Partial<DigitalIdentityFilters>> => {
    let mustNotFilters: Partial<DigitalIdentityFilters> = {};
    // let rule: RuleFilter = { field: 'source', values: ['!es_name'], entityType: 'Digital Identity' };
    // filtersQuery.push(rule);
    console.log((<RuleFilter[]>filtersQuery)[0]);
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[digitalIdentityMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }

    return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<DigitalIdentityFilters>>;
};

export const extractRoleFiltersQuery = (
    filtersQuery: RuleFilter[] = [],
    userQuery: Partial<RoleFilters> = {},
): FilterQueries<Partial<RoleFilters>> => {
    let mustNotFilters: Partial<RoleFilters> = {};
    for (const filterRule of filtersQuery) {
        if (mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] === undefined) {
            mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = [];
        }
        mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] = (
            mustNotFilters[roleMapFieldType!.get(filterRule.field)!.get(filterRule.entityType)!] as []
        ).concat(filterRule.values as []);
    }

    return { userFilters: userQuery, ruleFilters: mustNotFilters } as FilterQueries<Partial<RoleFilters>>;
};

export default { extractEntityFiltersQuery, extractGroupFiltersQuery };
