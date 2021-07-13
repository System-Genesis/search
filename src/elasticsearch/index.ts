/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import * as esb from 'elastic-builder';
import * as fs from 'fs';
import { generateKeyPairSync } from 'crypto';
import indexes from './settings/index';
import clientElastic from './elasticSearchClientConfiguration';
import config from '../config';
import { EntityFilters } from '../express/entity/textSearchInterface';
import { DigitalIdentityFilters } from '../express/digitalIdentity/textSearchInterface';
import { RoleFilters } from '../express/role/textSearchInterface';
import { FilterQueries } from '../types';

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

    const query = {
        displayName,
        ...filters?.userFilters,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in if
        if (!!val && typeof val === 'string' && val.trim().length >= config.elasticsearch.fullTextFieldMinLength && key === 'displayName') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        } else {
            const termQuery = Array.isArray(val) ? esb.termsQuery(key, val) : esb.termQuery(key, val!.toString());
            filter.push(termQuery);
        }
    }
    for (const key in filters?.ruleFilters) {
        const termQuery = Array.isArray(filters?.ruleFilters[key])
            ? esb.termsQuery(key, filters?.ruleFilters[key])
            : esb.termQuery(key, filters?.ruleFilters[key].toString());
        mustNot.push(termQuery);
    }
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().must(must).should(should).filter(filter)).toJSON();
    return requestBody;
}
export const buildQueryDI = (uniqueId: string, filters?: Partial<DigitalIdentityFilters>) => {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const query = {
        uniqueId,
        ...filters,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // uniqueid in if
        if (!!val && typeof val === 'string' && val.trim().length >= config.elasticsearch.fullTextFieldMinLength && key === 'uniqueId') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        } else {
            const termQuery = Array.isArray(val) ? esb.termsQuery(key, val) : esb.termQuery(key, val!.toString());
            filter.push(termQuery);
        }
    }
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().must(must).should(should).filter(filter)).toJSON();
    return requestBody;
};

export function buildQueryRole(roleId: string, filters?: Partial<RoleFilters>) {
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const query = {
        roleId,
        ...filters,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        // DISPLAYNAME in if
        if (!!val && typeof val === 'string' && val.trim().length >= config.elasticsearch.fullTextFieldMinLength && key === 'roleId') {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        } else {
            const termQuery = Array.isArray(val) ? esb.termsQuery(key, val) : esb.termQuery(key, val!.toString());
            filter.push(termQuery);
        }
    }
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().must(must).should(should).filter(filter)).toJSON();
    return requestBody;
}

export default { initElasticIndexes };
