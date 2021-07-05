/* eslint-disable no-extra-boolean-cast */
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
        if (!!name) {
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).boost(1.2));
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).fuzziness('AUTO'));
        }
        if (!!hierarchy) should.push(esb.matchQuery(`hierarchy.${fullTextFieldName}`, hierarchy));
        if (!!underGroupId) filter.push(esb.termQuery('ancestors', underGroupId));
        if (isAlive !== undefined) {
            const typeAlive: string = isAlive.toString() === 'true' ? 'active' : 'inactive';
            filter.push(esb.termQuery('status', typeAlive));
        }
        let response: any = [];
        try {
            const queryBody = esb.requestBodySearch().query(esb.boolQuery().should(should).filter(filter).minimumShouldMatch(1)).toJSON();
            // eslint-disable-next-line no-return-await
            response = await this.search(queryBody);
        } catch (err) {
            console.log(err);
        }

        return response;
    }
}

export default new ElasticGroupRepository();
