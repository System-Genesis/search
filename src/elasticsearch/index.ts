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
                files[index].fullName = files[index].firstName + ' ' + files[index].lastName;
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

export function buildQuery(displayName: string, filters?: FilterQueries<Partial<EntityFilters>>) {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const excludedFields: string[] = ['digitalIdentities'];
    const hiddenFields: string[] = ['hierarchyIds', 'pictures.meta.path'];
    const query = {
        fullName: displayName,
    };
    let isExpanded = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in if
        if (!!val && typeof val === 'string') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2).fuzziness('AUTO');
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO').boost(1.2));
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

export const buildQueryDI = (uniqueId: string, filters?: FilterQueries<Partial<DigitalIdentityFilters>>) => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const excludedFields: string[] = ['role'];
    const query = {
        uniqueId,
    };
    let isExpanded = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in idsad
        if (!!val && typeof val === 'string') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2).fuzziness('AUTO');
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO').boost(1.2));
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
        .query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter))
        .source({ excludes: !isExpanded ? excludedFields : [] })
        .toJSON();
    return requestBody;
};

export function buildQueryRole(roleId: string, filters?: FilterQueries<Partial<RoleFilters>>) {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];

    const query = {
        roleId,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in if
        if (!!val && typeof val === 'string') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
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
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter)).toJSON();
    return requestBody;
}

export function buildQueryGroup(query: Partial<GroupQuery>, filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} }) {
    const { underGroupId, isAlive, status, expanded } = filters.userFilters;
    const { hierarchy, name, nameAndHierarchy } = query;
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];
    const must: esb.Query[] = [];
    const excludedFields: string[] = ['directEntities', 'directRole'];
    let isExpanded = false;
    if (!!nameAndHierarchy) {
        should.push(esb.matchQuery(`name.${config.elasticsearch.fullTextFieldName}`, nameAndHierarchy).fuzziness('AUTO').boost(2.4));
        should.push(esb.matchQuery(`hierarchy.${config.elasticsearch.fullTextFieldName}`, nameAndHierarchy).fuzziness('AUTO').boost(1.2));
    }
    if (!!name) {
        should.push(esb.matchQuery(`name.${config.elasticsearch.fullTextFieldName}`, name).fuzziness('AUTO').boost(1.2));
        must.push(esb.matchQuery(`name.${config.elasticsearch.fullTextFieldName}`, name).fuzziness('AUTO').boost(1.2));
    }
    if (!!hierarchy) {
        should.push(esb.matchQuery(`hierarchy.${config.elasticsearch.fullTextFieldName}`, hierarchy).fuzziness('AUTO').boost(1.2));
    }
    if (!!expanded && expanded.includes(true)) {
        isExpanded = true;
    }

    if (!!underGroupId && underGroupId.length !== 0) {
        if (underGroupId !== undefined && underGroupId.length !== 0) {
            const mustNotArr: string[] = Array.isArray(underGroupId) ? filterMustNotArr(underGroupId) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(underGroupId) ? filterMustArr(underGroupId) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery('ancestors', mustArr);
                filter.push(termQuery);
            }
        }
    }
    if (isAlive !== undefined && isAlive.length !== 0) {
        for (const alive of isAlive) {
            const typeAlive: string = alive.toString() === 'true' ? 'active' : 'inactive';
            filter.push(esb.termQuery('status', typeAlive));
        }
    }
    if (!!status && status.length !== 0) {
        const mustNotArr: string[] = Array.isArray(status) ? filterMustNotArr(status) : [];
        if (mustNotArr.length !== 0) {
            const termNotQuery = esb.termsQuery('status', mustNotArr);
            mustNot.push(termNotQuery);
        }
        const mustArr: string[] = Array.isArray(status) ? filterMustArr(status) : [];
        if (mustArr.length !== 0) {
            const termQuery = esb.termsQuery('status', mustArr);
            filter.push(termQuery);
        }
    }
    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(true)) {
                    isExpanded = true;
                }
            } else {
                if (key === 'isAlive') {
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
                        // mustNot.push(esb.termsQuery('ancestors', filters?.ruleFilters[key] as []));
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
    }

    const queryBody = esb
        .requestBodySearch()
        .query(esb.boolQuery().should(should).mustNot(mustNot).must(must).filter(filter).minimumShouldMatch(1))
        .source({ excludes: !isExpanded ? excludedFields : [] })
        .toJSON();
    // eslint-disable-next-line no-return-await
    return queryBody;
}

export default { initElasticIndexes };
