/* eslint-disable no-return-await */
import { Client } from '@elastic/elasticsearch';
import { buildQueryDI } from '../../elasticsearch/index';
import config from '../../config';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { IDigitalIdentity } from './interface';
import { DigitalIdentityFilters, DigitalIdentityTextSearch } from './textSearchInterface';
import { FilterQueries } from '../../types';

const {
    indexNames: { digitalIdentities: _indexName },
} = config.elasticsearch;
const excludedFields: string[] = ['role'];

export class ElasticDIRepository extends ElasticSearchBaseRepository<IDigitalIdentity> implements DigitalIdentityTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig, excludedFields);
    }

    async searchByFullName(uniqueId: string, filters?: FilterQueries<Partial<DigitalIdentityFilters>>) {
        return await this.search(buildQueryDI(uniqueId, filters, this.excludedFields));
    }
}

export default new ElasticDIRepository();
