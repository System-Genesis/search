/* eslint-disable no-restricted-syntax */
/* eslint-disable no-extra-boolean-cast */
import { Client } from '@elastic/elasticsearch';
import * as esb from 'elastic-builder';
import config from '../../config';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { FilterQueries } from '../../types';
import { filterMustArr, filterMustNotArr } from '../../utils/middlwareHelpers';
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

    async searchByNameAndHierarchy(query: Partial<GroupQuery>, filters: FilterQueries<Partial<GroupFilters>> = { userFilters: {}, ruleFilters: {} }) {
        const { underGroupId, isAlive } = filters.userFilters;
        const { hierarchy, name } = query;
        const should: esb.Query[] = [];
        const filter: esb.Query[] = [];
        const mustNot: esb.Query[] = [];

        if (!!name) {
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).boost(1.2));
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).fuzziness('AUTO'));
        }
        if (!!hierarchy) should.push(esb.matchQuery(`hierarchy.${fullTextFieldName}`, hierarchy));
        if (!!underGroupId) filter.push(esb.termsQuery('ancestors', underGroupId));
        if (isAlive !== undefined) {
            const typeAlive: string = isAlive.toString() === 'true' ? 'active' : 'inactive';
            filter.push(esb.termQuery('status', typeAlive));
        }
        for (const key in filters?.ruleFilters) {
            if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
                const termNotQuery = Array.isArray(filters?.ruleFilters[key])
                    ? esb.termsQuery(key, filterMustNotArr(filters!.ruleFilters[key]))
                    : esb.termQuery(key, filters?.ruleFilters[key].toString());
                mustNot.push(termNotQuery);

                const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters!.ruleFilters[key]) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery(key, mustArr);
                    filter.push(termQuery);
                }
            }
        }

        let response: any = [];
        try {
            const queryBody = esb
                .requestBodySearch()
                .query(esb.boolQuery().should(should).mustNot(mustNot).filter(filter).minimumShouldMatch(1))
                .toJSON();
            // eslint-disable-next-line no-return-await
            response = await this.search(queryBody);
        } catch (err) {
            console.log(err);
        }

        return response;
    }
}

export default new ElasticGroupRepository();
