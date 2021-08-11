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

export async function initElasticIndexes() {
    // eslint-disable-next-line no-restricted-syntax

    for (const indexSetting of indexes) {
        const { settings = {}, mappings = {}, name } = indexSetting;
        if ((await clientElastic.indices.exists({ index: name })).statusCode === 404) {
            const res = await clientElastic.indices.create({
                index: name,
                body: { settings, mappings },
            });
            console.log(res);
        }
    }
}
export async function isAlive() {
    console.log('Checking connection...');
    try {
        const res = await clientElastic.cluster.health();
        console.log(res);
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
    const excludedFields: string[] = [];
    const query = {
        displayName,
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
            if (key === 'expanded') {
                if (filters!.userFilters[key]?.includes(false)) {
                    excludedFields.push('digitalIdentities');
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
                if (filters!.ruleFilters[key]?.includes(false)) {
                    excludedFields.push('digitalIdentities');
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
        .source({ excludes: excludedFields })
        .toJSON();
    return requestBody;
}

export const buildQueryDI = (uniqueId: string, filters?: FilterQueries<Partial<DigitalIdentityFilters>>) => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const mustNot: esb.Query[] = [];

    const query = {
        uniqueId,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in idsad
        if (!!val && typeof val === 'string') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        }
    }
    for (const key in filters?.userFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.userFilters, key)) {
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
    for (const key in filters?.ruleFilters) {
        if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
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
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter)).toJSON();
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
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().mustNot(mustNot).must(must).should(should).filter(filter)).toJSON();
    return requestBody;
}

export default { initElasticIndexes };
