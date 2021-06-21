/* eslint-disable no-await-in-loop */

import * as esb from 'elastic-builder';
import indexes from './settings/index';
import clientElastic from './elasticSearchClientConfiguration';
import config from '../config';

// export const initElasticIndexes = async (elasticClient: Client) => {
//     await Promise.all(
//         indexes.map(async (indexSettings) => {
//             const { settings, mappings } = indexSettings;
//             if (
//                 (
//                     await elasticClient.indices.exists({
//                         index: indexSettings.name,
//                     })
//                 ).statusCode === 404
//             ) {
//                 await elasticClient.indices.create({
//                     index: indexSettings.name,
//                     body: { settings, mappings },
//                 });
//             }
//         }),
//     );
// };

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

export function buildQuery(fullName: string, filters?: Partial<any>) {
    // filters?: Partial<EntityFilters>
    const must: esb.Query[] = [];
    const should: esb.Query[] = [];
    const filter: esb.Query[] = [];
    const query = {
        fullName,
        ...filters,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(query)) {
        if (!!val && typeof val === 'string' && val.trim().length >= config.elasticsearch.fullTextFieldMinLength) {
            const textField = `${key}.${config.elasticsearch.fullTextFieldName}}`;
            const exactQuery = esb.matchQuery(textField, val).boost(1.2);
            should.push(exactQuery);
            must.push(esb.matchQuery(textField, val).fuzziness('AUTO'));
        } else {
            const termQuery = Array.isArray(val) ? esb.termsQuery(key, val) : esb.termQuery(key, val.toString());
            filter.push(termQuery);
        }
    }
    const requestBody = esb.requestBodySearch().query(esb.boolQuery().must(must).should(should).filter(filter)).toJSON();
    return requestBody;
}

export default { initElasticIndexes };
