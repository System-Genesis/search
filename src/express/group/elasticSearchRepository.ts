/* eslint-disable no-restricted-syntax */
/* eslint-disable no-extra-boolean-cast */
import { Client } from '@elastic/elasticsearch';
import * as esb from 'elastic-builder';
import config from '../../config';
import { buildQueryGroup } from '../../elasticsearch';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { FilterQueries } from '../../types';
import { IOrganizationGroup } from './interface';
import { GroupFilters, GroupQuery, OrganizationGroupTextSearch } from './textSearchInterface';

const {
    indexNames: { organizationGroups: _indexName },
} = config.elasticsearch;

class ElasticGroupRepository extends ElasticSearchBaseRepository<IOrganizationGroup> implements OrganizationGroupTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig);
    }

    async searchByNameAndHierarchy(query: Partial<GroupQuery>, filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} }) {
        const response = await this.search(buildQueryGroup(query, filters));

        return response;
    }
}

export default new ElasticGroupRepository();
