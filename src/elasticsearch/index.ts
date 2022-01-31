/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import * as esb from 'elastic-builder';
import * as fs from 'fs';

import indexes from './settings/index';
import clientElastic from './elasticSearchClientConfiguration';
import config from '../config';
import { EntityFilters } from '../express/entity/textSearchInterface';
import { DigitalIdentityFilters } from '../express/digitalIdentity/textSearchInterface';
import { RoleFilters } from '../express/role/textSearchInterface';
import { FilterQueries } from '../types';
import { filterMustArr, filterMustNotArr } from '../utils/middlwareHelpers';
import { GroupQuery, GroupFilters } from '../express/group/textSearchInterface';

export async function initElasticIndexes() {
    // eslint-disable-next-line no-restricted-syntax

    for (const indexSetting of indexes) {
        const { settings = {}, mappings = {}, name } = indexSetting;
        if ((await clientElastic.indices.exists({ index: name })).statusCode === 404) {
            await clientElastic.indices.create({
                index: name,
                body: { settings, mappings },
            });
        }
    }
}
export async function isAlive() {
    console.log('Checking connection...');
    try {
        await clientElastic.cluster.health();
        return true;
    } catch (err) {
        return false;
    }
}
export async function deleteElasticData() {
    try {
        // eslint-disable-next-line no-restricted-syntax
        for (const indexSetting of indexes) {
            await clientElastic.deleteByQuery({
                index: indexSetting.name,
                body: {
                    query: {
                        match_all: {},
                    },
                },
            });
        }
        await clientElastic.indices.delete({
            index: '_all',
        });
    } catch (err) {
        console.log(err);
    }
}

export async function readJsonAndWriteElastic(path: string, modelType: string, identifierKey: string) {
    const files: any = JSON.parse(fs.readFileSync(path, 'utf-8'));

    try {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < files.length; index++) {
            if (modelType === config.elasticsearch.indexNames.entities) {
                files[index].fullName = `${files[index].firstName} ${files[index].lastName}`;
            }
            await clientElastic.index({
                index: modelType,

                id: files[index][identifierKey].toString(),
                body: files[index],
            });
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Builds the query bool for the Entity route by match and fuzziness
 * @example ("תומי אפק" , {userFilters: {source: ['es_name']}, ruleFilters: {source: ['city_name']}}, 'digitalIdentities', 'hierarchyIds')
 * @param displayName The displayName you desire.
 * @param filters Filters, divided to User and Rule filters, User: field queries to filter from the client, Rule: field queries to not show to the user
 * @param excludedFields Fields to exclude, inherited from the Elasticsearch class repository
 * @param hiddenFields Fields to hide, inherited from the Elasticsearch class repository
 * @returns The closest name that belongs to the fullName with hidden fields, excluded fields, filters and rules specified.
 */
export function buildQuery(
    displayName: string,
    filters?: FilterQueries<Partial<EntityFilters>>,
    excludedFields: string[] = [],
    hiddenFields: string[] = [],
) {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const query = {
        fullName: displayName,
    };
    let isExpanded = false;

    for (const [key, val] of Object.entries(query)) {
        if (!!val && typeof val === 'string') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        }
    }
    for (const key in filters?.userFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.userFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else {
                const mustNotArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustNotArr(filters!.userFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustArr(filters!.userFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    filter.push(termQuery);
                }
            }
        }
    }
    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
            if (key === 'expanded') {
                if (filters!.ruleFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else {
                const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters!.ruleFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    mustNot.push(termQuery);
                }
            }
        }
    }
    const requestBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter))
        .source({ excludes: !isExpanded ? excludedFields.concat(hiddenFields) : hiddenFields })
        .toJSON();
    return requestBody;
}

/**
 * Builds the query bool for the DI route by prefix and regex search
 * @example ("t231@rabbiran.com" , {userFilters: {source: ['es_name']}, ruleFilters: {source: ['city_name']}}, 'directRole')
 * @param uniqueId The uniqueId you desire.
 * @param filters Filters, divided to User and Rule filters, User: field queries to filter from the client, Rule: field queries to not show to the user
 * @param excludedFields Fields to exclude, inherited from the Elasticsearch class repository
 * @returns The closest digital identitiy that belongs to the uniqueId with the excluded fields, filters and rules specified,
 * if the uniqueId does not have a domain it`s prioritized to the exact uniqueId with different domains.
 */
export const buildQueryDI = (uniqueId: string, filters?: FilterQueries<Partial<DigitalIdentityFilters>>, excludedFields: string[] = []) => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const query = {
        uniqueId,
    };
    let isExpanded = false;

    for (const [key, val] of Object.entries(query)) {
        if (!!val && typeof val === 'string') {
            must.push(esb.prefixQuery(key, val));
            should.push(esb.queryStringQuery(`${val}@*`).field(key));
        }
    }
    for (const key in filters?.userFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.userFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else {
                const mustNotArr: any[] = Array.isArray(filters?.userFilters[key]) ? filterMustNotArr(filters!.userFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: any[] = Array.isArray(filters?.userFilters[key]) ? filterMustArr(filters!.userFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    filter.push(termQuery);
                }
            }
        }
    }
    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else {
                const mustNotArr: any[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters!.ruleFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: any[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    mustNot.push(termQuery);
                }
            }
        }
    }
    const requestBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter).minimumShouldMatch(0))
        .source({ excludes: !isExpanded ? excludedFields : [] })
        .toJSON();
    return requestBody;
};

/**
 * Builds the query bool for the Role route by prefix and regex search
 * @example ("t231@rabbiran.com" , {userFilters: {source: ['es_name']}, ruleFilters: {source: ['city_name']}})
 * @param roleId The uniqueId you desire.
 * @param filters Filters, divided to User and Rule filters, User: field queries to filter from the client, Rule: field queries to not show to the user
 * @returns The closest digital identitiy that belongs to the uniqueId with the filters and rules specified,
 * if the uniqueId does not have a domain it`s prioritized to the exact uniqueId with different domains.
 */
export function buildQueryRole(roleId: string, filters?: FilterQueries<Partial<RoleFilters>>) {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const query = {
        roleId,
    };

    for (const [key, val] of Object.entries(query)) {
        if (!!val && typeof val === 'string') {
            must.push(esb.prefixQuery(key, val));
            should.push(esb.queryStringQuery(`${val}@*`).field(key));
        }
    }
    for (const key in filters?.userFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.userFilters, key)) {
            const mustNotArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustNotArr(filters!.userFilters[key]) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery(key, mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustArr(filters!.userFilters[key]) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery(key, mustArr);
                filter.push(termQuery);
            }
        }
    }
    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
            const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery(key, mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery(key, mustArr);
                mustNot.push(termQuery);
            }
        }
    }
    const requestBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter).minimumShouldMatch(0))
        .toJSON();
    return requestBody;
}

/**
 * Builds the query bool for the Group route by multi match queries from each fields and both fields as one big field
 * @example ("מערך גבינה/מדור ראש פלאפל/צוות הפלאש" , {userFilters: {source: ['es_name']}, ruleFilters: {source: ['city_name']}}, 'directEntities')
 * @param query The query you desire to search with, either nameAndHierarchy or {name, hierarchy} or name or hierarchy.
 * @param filters Filters, divided to User and Rule filters, User: field queries to filter from the client, Rule: field queries to not show to the user
 * @param excludedFields Fields to exclude, inherited from the Elasticsearch class repository.
 * @returns The closest groups that belongs to the uniqueId with the excluded fields, filters and rules specified,
 * Mostly used by nameAndHierarchy query search. so the search is prioritzing the field that has best accuracy between hierarchy and name and
 * Also, the best score from both fields together.
 */
export function buildQueryGroup(
    query: Partial<GroupQuery>,
    filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} },
    excludedFields: string[] = [],
) {
    const { hierarchy, name, nameAndHierarchy } = query;
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const must: esb.Query[] = [];
    let isExpanded = false;
    let m = 2;
    if (nameAndHierarchy) {
        should.push(
            esb
                .multiMatchQuery(
                    [`name.${config.elasticsearch.fullTextFieldName}`, `hierarchy.${config.elasticsearch.fullTextFieldName}`],
                    nameAndHierarchy,
                )
                .type('cross_fields')
                .boost(1.2),
        );
        should.push(
            esb
                .multiMatchQuery(
                    [`name.${config.elasticsearch.fullTextFieldName}`, `hierarchy.${config.elasticsearch.fullTextFieldName}`],
                    nameAndHierarchy,
                )
                .type('most_fields')
                .fuzziness('AUTO')
                .boost(1.2),
        );
    }
    if (name) {
        m = 1;
        should.push(esb.matchQuery(`name.${config.elasticsearch.fullTextFieldName}`, name).fuzziness('AUTO').boost(1.2));
        must.push(esb.matchQuery(`name.${config.elasticsearch.fullTextFieldName}`, name).fuzziness('AUTO').boost(1.2));
    }
    if (hierarchy) {
        m = 1;
        should.push(esb.matchQuery(`hierarchy.${config.elasticsearch.fullTextFieldName}`, hierarchy).fuzziness('AUTO').boost(1.2));
    }
    for (const key in filters.userFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.userFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else if (key === 'status') {
                if (filters?.userFilters[key] !== undefined && (filters?.userFilters[key] as []).length !== 0) {
                    for (const alive of filters?.userFilters[key] as []) {
                        const typeAlive: string = (alive as any).toString() === 'true' ? 'active' : 'inactive';
                        filter.push(esb.termQuery('status', typeAlive));
                    }
                }
            } else if (key === 'underGroupId') {
                if (filters?.userFilters[key] !== undefined && (filters?.userFilters[key] as []).length !== 0) {
                    const mustNotArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustNotArr(filters.userFilters[key] as []) : [];
                    if (mustNotArr.length !== 0) {
                        const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                        mustNot.push(termNotQuery);
                    }
                    const mustArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustArr(filters.userFilters[key] as []) : [];
                    if (mustArr.length !== 0) {
                        const termQuery = esb.termsQuery('ancestors', mustArr);
                        filter.push(termQuery);
                    }
                }
            } else {
                const mustNotArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustNotArr(filters!.userFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(filters?.userFilters[key]) ? filterMustArr(filters!.userFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    filter.push(termQuery);
                }
            }
        }
    }

    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else if (key === 'isAlive') {
                if (filters?.ruleFilters[key] !== undefined && (filters?.ruleFilters[key] as []).length !== 0) {
                    for (const alive of filters?.ruleFilters[key] as []) {
                        const typeAlive: string = (alive as any).toString() === 'true' ? 'active' : 'inactive';
                        mustNot.push(esb.termQuery('status', typeAlive));
                    }
                }
            } else if (key === 'underGroupId') {
                if (filters?.ruleFilters[key] !== undefined && (filters?.ruleFilters[key] as []).length !== 0) {
                    const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters.ruleFilters[key] as []) : [];
                    if (mustNotArr.length !== 0) {
                        const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                        mustNot.push(termNotQuery);
                    }
                    const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters.ruleFilters[key] as []) : [];
                    if (mustArr.length !== 0) {
                        const termQuery = esb.termsQuery('ancestors', mustArr);
                        mustNot.push(termQuery);
                    }
                }
            } else {
                const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters!.ruleFilters[key]) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery(key, mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    mustNot.push(termQuery);
                }
            }
        }
    }

    const queryBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().should(should).mustNot(mustNot).must(must).filter(filter).minimumShouldMatch(m))
        .source({ excludes: !isExpanded ? excludedFields : [] })
        .toJSON();
    // eslint-disable-next-line no-return-await
    return queryBody;
}

export default { initElasticIndexes };
