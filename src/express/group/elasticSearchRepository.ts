import { Client } from '@elastic/elasticsearch';
import * as esb from 'elastic-builder';
import config from '../../config';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { IOrganizationGroup } from './interface';
import { GroupFilters, GroupQuery, OrganizationGroupTextSearch } from './textSearchInterface';

const {
    indexNames: { organizationGroups: _indexName },
    fullTextFieldName,
} = config.elasticsearch;

class ElasticGroupRepository extends ElasticSearchBaseRepository<IOrganizationGroup> implements OrganizationGroupTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig);
    }

    async searchByNameAndHierarchy(query: Partial<GroupQuery>, filters: Partial<GroupFilters> = {}) {
        const { underGroupId, isAlive } = filters;
        const { hierarchy, name } = query;
        const should: esb.Query[] = [];
        const filter: esb.Query[] = [];
        if (name) {
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).boost(1.2));
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).fuzziness('AUTO'));
        }
        if (hierarchy) should.push(esb.matchQuery(`hierarchy.${fullTextFieldName}`, hierarchy));
        if (underGroupId) filter.push(esb.termQuery('ancestors', underGroupId));
        if (isAlive !== undefined) filter.push(esb.termQuery('isAlive', isAlive));

        const queryBody = esb.requestBodySearch().query(esb.boolQuery().should(should).filter(filter).minimumShouldMatch(1)).toJSON();
        return this.search(queryBody);
    }
}

export default new ElasticGroupRepository();
