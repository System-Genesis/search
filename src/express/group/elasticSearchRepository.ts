/* eslint-disable no-restricted-syntax */
/* eslint-disable no-extra-boolean-cast */
import { Client } from '@elastic/elasticsearch';
import config from '../../config';
import { buildQueryGroup } from '../../elasticsearch';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { FilterQueries } from '../../types';
import { IOrganizationGroup } from './interface';
import { GroupFilters, GroupQuery, OrganizationGroupTextSearch } from './textSearchInterface';

const {
    indexNames: { organizationGroups: _indexName },
} = config.elasticsearch;
const excludedFields = ['directEntities', 'directRole'];

class ElasticGroupRepository extends ElasticSearchBaseRepository<IOrganizationGroup> implements OrganizationGroupTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig, excludedFields);
    }

    async searchByNameAndHierarchy(query: Partial<GroupQuery>, filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} }) {
        // eslint-disable-next-line no-underscore-dangle
        const response = await this.search(buildQueryGroup(query, filters, this._excludedFields));
        return response;
    }
}

export default new ElasticGroupRepository();
