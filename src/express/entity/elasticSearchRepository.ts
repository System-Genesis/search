/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
import { Client } from '@elastic/elasticsearch';
import config from '../../config';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
import { EntityFilters, EntityTextSearch } from './textSearchInterface';
import { buildQuery } from '../../elasticsearch/index';
import { FilterQueries } from '../../utils/types';
import { IEntity } from './interface';

const {
    indexNames: { entities: _indexName },
} = config.elasticsearch;

const excludedFields: string[] = ['digitalIdentities'];
const hiddenFields: string[] = ['hierarchyIds', 'pictures.meta.path'];

class ElasticEntityRepository extends ElasticSearchBaseRepository<IEntity> implements EntityTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig, excludedFields, hiddenFields);
    }

    async searchByFullName(fullName: string, filters: FilterQueries<Partial<EntityFilters>>) {
        return await this.search(buildQuery(fullName, filters, this.excludedFields, this.hiddenFields));
    }

    async insertElastic(entity: IEntity | IEntity[]): Promise<void> {
        if (!Array.isArray(entity)) {
            await this.insert(entity, entity.id);
        } else {
            for (let index = 0; index < entity.length; index += 1) {
                await this.insert(entity[index], entity[index].id);
            }
        }
    }
}

export default new ElasticEntityRepository();
