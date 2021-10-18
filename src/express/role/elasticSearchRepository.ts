/* eslint-disable no-return-await */
import { Client } from '@elastic/elasticsearch';
import config from '../../config';
import { buildQueryRole } from '../../elasticsearch';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { FilterQueries } from '../../types';
import { IRole } from './interface';
import { RoleFilters, RoleTextSearch } from './textSearchInterface';

const {
    indexNames: { roles: _indexName },
} = config.elasticsearch;

export class ElasticRoleRepository extends ElasticSearchBaseRepository<IRole> implements RoleTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig);
    }

    async searchByFullName(roleId: string, filters: FilterQueries<Partial<RoleFilters>>) {
        return await this.search(buildQueryRole(roleId, filters));
    }
}

export default new ElasticRoleRepository();
