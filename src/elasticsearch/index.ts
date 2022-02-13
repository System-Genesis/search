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
import { FilterQueries } from '../utils/types';
import { filterMustArr, filterMustNotArr } from '../utils/middlwareHelpers';
import { GroupQuery, GroupFilters } from '../express/group/textSearchInterface';

export async function initElasticIndexes() {
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
        for (let index = 0; index < files.length; index = +1) {
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
 * @param filters Filters, divided to User and Rule filters, User: field queries .asString(),
/** */
export const buildQuery = (
    fullName: string,
    filters: FilterQueries<Partial<EntityFilters>>,
    excludedFields: string[] = [],
    hiddenFields: string[] = [],
): object => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    let isExpanded = false;

    const textField = `fullName.${config.elasticsearch.fullTextFieldName}`;
    should.push(esb.matchQuery(textField, fullName).boost(config.elasticsearch.boost));
    must.push(esb.matchQuery(textField, fullName).fuzziness(config.elasticsearch.fuzziness));
    for (const key in filters.userFilters) {
        if (key === 'expanded') {
            if (filters.userFilters[key]?.includes(true)) {
                isExpanded = true;
            }
        } else {
            const mustNotArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustNotArr(filters.userFilters[key]) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery(key, mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustArr(filters.userFilters[key]) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery(key, mustArr);
                filter.push(termQuery);
            }
        }
    }
    for (const key in filters.ruleFilters) {
        if ((filters.ruleFilters[key] as []).length !== 0) {
            const termQuery = esb.termsQuery(key, filters.ruleFilters[key]);
            mustNot.push(termQuery);
        }
    }

    const requestBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter))
        .source({ excludes: !isExpanded ? excludedFields.concat(hiddenFields) : hiddenFields })
        .toJSON();
    return requestBody;
};

/**
 * Builds the query bool for the DI route by prefix and regex search
 * @example ("t231@rabbiran.com" , {userFilters: {source: ['es_name']}, ruleFilters: {source: ['city_name']}}, 'directRole')
 * @param uniqueId The uniqueId you desire.
 * @param filters Filters, divided to User and Rule filters, User: field queries to filter from the client, Rule: field queries to not show to the user
 * @param excludedFields Fields to exclude, inherited from the Elasticsearch class repository
 * @returns The closest digital identitiy that belongs to the uniqueId with the excluded fields, filters and rules specified,
 * if the uniqueId does not have a domain it`s prioritized to the exact uniqueId with different domains.
 */
export const buildQueryDI = (uniqueId: string, filters: FilterQueries<Partial<DigitalIdentityFilters>>, excludedFields: string[]): object => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    let isExpanded = false;

    must.push(esb.prefixQuery('uniqueId', uniqueId));
    should.push(esb.queryStringQuery(`${uniqueId}@*`).field('uniqueId'));
    for (const key in filters.userFilters) {
        if (key === 'expanded') {
            if (filters!.userFilters[key]?.includes(true)) {
                isExpanded = true;
            }
        } else {
            const mustNotArr: any[] = Array.isArray(filters.userFilters[key]) ? filterMustNotArr(filters.userFilters[key]) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery(key, mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: any[] = Array.isArray(filters.userFilters[key]) ? filterMustArr(filters.userFilters[key]) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery(key, mustArr);
                filter.push(termQuery);
            }
        }
    }
    for (const key in filters.ruleFilters) {
        if ((filters.ruleFilters[key] as []).length !== 0) {
            const termQuery = esb.termsQuery(key, filters.ruleFilters[key]);
            mustNot.push(termQuery);
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
export const buildQueryRole = (roleId: string, filters: FilterQueries<Partial<RoleFilters>>): object => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];

    must.push(esb.prefixQuery('roleId', roleId));
    should.push(esb.queryStringQuery(`${roleId}@*`).field('roleId'));
    for (const key in filters.userFilters) {
        const mustNotArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustNotArr(filters.userFilters[key]) : [];
        if (mustNotArr.length !== 0) {
            const termNotQuery = esb.termsQuery(key, mustNotArr);
            mustNot.push(termNotQuery);
        }
        const mustArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustArr(filters.userFilters[key]) : [];
        if (mustArr.length !== 0) {
            const termQuery = esb.termsQuery(key, mustArr);
            filter.push(termQuery);
        }
    }
    for (const key in filters.ruleFilters) {
        if ((filters.ruleFilters[key] as []).length !== 0) {
            const termQuery = esb.termsQuery(key, filters.ruleFilters[key]);
            mustNot.push(termQuery);
        }
    }

    const requestBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter).minimumShouldMatch(0))
        .toJSON();
    return requestBody;
};

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
export const buildQueryGroup = (
    query: Partial<GroupQuery>,
    filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} },
    excludedFields: string[],
): object => {
    const { hierarchy, name, nameAndHierarchy } = query;
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const must: esb.Query[] = [];
    let isExpanded = false;
    let minimumShouldMatch = 2;
    if (nameAndHierarchy) {
        const hierarchyTextField = `hierarchy.${config.elasticsearch.fullTextFieldName}`;
        const nameTextFIeld = `name.${config.elasticsearch.fullTextFieldName}`;
        should.push(
            esb.multiMatchQuery([nameTextFIeld, hierarchyTextField], nameAndHierarchy).type('cross_fields').boost(config.elasticsearch.boost),
        );
        should.push(
            esb
                .multiMatchQuery([nameTextFIeld, hierarchyTextField], nameAndHierarchy)
                .type('most_fields')
                .fuzziness(config.elasticsearch.fuzziness)
                .boost(config.elasticsearch.boost),
        );
    }
    if (name) {
        minimumShouldMatch = 1;
        const textField = `name.${config.elasticsearch.fullTextFieldName}`;
        should.push(esb.matchQuery(textField, name).fuzziness(config.elasticsearch.fuzziness).boost(config.elasticsearch.boost));
        must.push(esb.matchQuery(textField, name).fuzziness(config.elasticsearch.fuzziness).boost(config.elasticsearch.boost));
    }
    if (hierarchy) {
        minimumShouldMatch = 1;
        const textField = `hierarchy.${config.elasticsearch.fullTextFieldName}`;
        should.push(esb.matchQuery(textField, hierarchy).fuzziness(config.elasticsearch.fuzziness).boost(config.elasticsearch.boost));
    }
    for (const key in filters.userFilters) {
        if (key === 'expanded') {
            if (filters.userFilters[key]?.includes(true)) {
                isExpanded = true;
            }
        } else if (key === 'isAlive') {
            if ((filters.userFilters[key] as []).length !== 0) {
                for (const alive of filters.userFilters[key] as boolean[]) {
                    const typeAlive: string = alive.toString() === 'true' ? 'active' : 'inactive';
                    filter.push(esb.termQuery('status', typeAlive));
                }
            }
        } else if (key === 'underGroupId') {
            if ((filters.userFilters[key] as []).length !== 0) {
                const mustNotArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustNotArr(filters.userFilters[key] as []) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustArr(filters.userFilters[key] as []) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery('ancestors', mustArr);
                    filter.push(termQuery);
                }
            }
        } else {
            const mustNotArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustNotArr(filters.userFilters[key]) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery(key, mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(filters.userFilters[key]) ? filterMustArr(filters.userFilters[key]) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery(key, mustArr);
                filter.push(termQuery);
            }
        }
    }

    for (const key in filters.ruleFilters) {
        if (key === 'isAlive') {
            for (const alive of filters.ruleFilters[key] as boolean[]) {
                const typeAlive: string = alive.toString() === 'true' ? 'active' : 'inactive';
                mustNot.push(esb.termQuery('status', typeAlive));
            }
        } else if (key === 'underGroupId') {
            if ((filters.ruleFilters[key] as []).length !== 0) {
                const termQuery = esb.termsQuery('ancestors', filters.ruleFilters[key]);
                mustNot.push(termQuery);
            }
        } else if ((filters.ruleFilters[key] as []).length !== 0) {
            const termQuery = esb.termsQuery(key, filters.ruleFilters[key]);
            mustNot.push(termQuery);
        }
    }

    const queryBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().should(should).mustNot(mustNot).must(must).filter(filter).minimumShouldMatch(minimumShouldMatch))
        .source({ excludes: !isExpanded ? excludedFields : [] })
        .toJSON();
    return queryBody;
};

export default { initElasticIndexes };

// const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters!.ruleFilters[key]) : [];
// if (mustNotArr.length !== 0) {
//     const termNotQuery = esb.termsQuery(key, mustNotArr);
//     mustNot.push(termNotQuery);
// }
