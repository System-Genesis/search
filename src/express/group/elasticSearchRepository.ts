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
        const { underGroupId, isAlive, status } = filters.userFilters;
        const { hierarchy, name } = query;
        const should: esb.Query[] = [];
        const filter: esb.Query[] = [];
        const mustNot: esb.Query[] = [];

        if (!!name) {
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).boost(1.2));
            should.push(esb.matchQuery(`name.${fullTextFieldName}`, name).fuzziness('AUTO'));
        }
        if (!!hierarchy) {
            should.push(esb.matchQuery(`hierarchy.${fullTextFieldName}`, hierarchy).boost(1.2));
            should.push(esb.matchQuery(`hierarchy.${fullTextFieldName}`, hierarchy).fuzziness('AUTO'));
        }

        if (!!underGroupId && underGroupId.length !== 0) {
            if (underGroupId !== undefined && underGroupId.length !== 0) {
                const mustNotArr: string[] = Array.isArray(underGroupId) ? filterMustNotArr(underGroupId) : [];
                if (mustNotArr.length !== 0) {
                    const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                    mustNot.push(termNotQuery);
                }
                const mustArr: string[] = Array.isArray(underGroupId) ? filterMustArr(underGroupId) : [];
                if (mustArr.length !== 0) {
                    const termQuery = esb.termsQuery('ancestors', mustArr);
                    filter.push(termQuery);
                }
            }
        }
        if (isAlive !== undefined && isAlive.length !== 0) {
            for (const alive of isAlive) {
                const typeAlive: string = alive.toString() === 'true' ? 'active' : 'inactive';
                filter.push(esb.termQuery('status', typeAlive));
            }
        }
        if (!!status && status.length !== 0) {
            const mustNotArr: string[] = Array.isArray(status) ? filterMustNotArr(status) : [];
            if (mustNotArr.length !== 0) {
                const termNotQuery = esb.termsQuery('status', mustNotArr);
                mustNot.push(termNotQuery);
            }
            const mustArr: string[] = Array.isArray(status) ? filterMustArr(status) : [];
            if (mustArr.length !== 0) {
                const termQuery = esb.termsQuery('status', mustArr);
                filter.push(termQuery);
            }
        }
        for (const key in filters?.ruleFilters) {
            if (Object.prototype.hasOwnProperty.call(filters?.ruleFilters, key)) {
                if (key === 'isAlive') {
                    if (filters?.ruleFilters[key] !== undefined && (filters?.ruleFilters[key] as []).length !== 0) {
                        for (const alive of filters?.ruleFilters[key] as []) {
                            const typeAlive: string = (alive as any).toString() === 'true' ? 'active' : 'inactive';
                            filter.push(esb.termQuery('status', typeAlive));
                        }
                    }
                } else if (key === 'underGroupId') {
                    if (filters?.ruleFilters[key] !== undefined && (filters?.ruleFilters[key] as []).length !== 0) {
                        const mustNotArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustNotArr(filters.ruleFilters[key] as []) : [];
                        if (mustNotArr.length !== 0) {
                            const termNotQuery = esb.termsQuery('ancestors', mustNotArr);
                            mustNot.push(termNotQuery);
                        }
                        const mustArr: string[] = Array.isArray(filters?.ruleFilters[key]) ? filterMustArr(filters.ruleFilters[key] as []) : [];
                        if (mustArr.length !== 0) {
                            const termQuery = esb.termsQuery('ancestors', mustArr);
                            filter.push(termQuery);
                        }
                        filter.push(esb.termsQuery('ancestors', filters?.ruleFilters[key] as []));
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
                        filter.push(termQuery);
                    }
                }
            }
        }

        const queryBody = esb
            .requestBodySearch()
            .query(esb.boolQuery().should(should).mustNot(mustNot).filter(filter).minimumShouldMatch(1))
            .toJSON();
        // eslint-disable-next-line no-return-await
        const response = await this.search(queryBody);

        return response;
    }
}

export default new ElasticGroupRepository();
