/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
import { Client } from '@elastic/elasticsearch';
import config from '../../config';
import { ElasticSearchBaseRepository, QueryConfig } from '../../elasticsearch/elasticSearchBaseRepository';
// import { IDigitalIdentity } from '../digitalIdentity/interface';
import { IEntity, ProfilePictureMeta } from './interface';
import { EntityFilters, EntityTextSearch } from './textSearchInterface';
import { buildQuery } from '../../elasticsearch/index';
import { FilterQueries } from '../../types';

export type EntitySource = Omit<IEntity, 'pictures'> & {
    hierarchyPath: string;
    pictures?: {
        profile?: {
            url: string;
            meta: ProfilePictureMeta & { path?: string };
        };
    };
};

const {
    indexNames: { entities: _indexName },
} = config.elasticsearch;

class ElasticEntityRepository extends ElasticSearchBaseRepository<EntitySource> implements EntityTextSearch {
    constructor(indexName: string = _indexName, elasticClient?: Client, queryConfig?: QueryConfig) {
        super(indexName, elasticClient, queryConfig);
    }

    async searchByFullName(fullName: string, filters?: FilterQueries<Partial<EntityFilters>>) {
        // eslint-disable-next-line no-return-await
        return await this.search(buildQuery(fullName, filters));
    }

    async insertElastic(entity: EntitySource | EntitySource[]): Promise<void> {
        if (!Array.isArray(entity)) {
            await this.insert(entity, entity.id);
        } else {
            for (let index = 0; index < entity.length; index++) {
                await this.insert(entity[index], entity[index].id);
            }
        }
    }

    // private transformPersonResult(person: EntitySource): IEntity {
    //     const { hierarchyPath, ...tPerson } = { ...person };
    //     const DomainSeperator="@";
    //     if (tPerson.digitalIdentities) {
    //       tPerson.digitalIdentities = (tPerson.digitalIdentities as IDigitalIdentity[]).map((u) => {
    //         const user: Partial<IDigitalIdentity> = {};

    //         const { source, mail } = u;
    //         user.uniqueId = `${u.name}${DomainSeperator}${u.domain}`;
    //         domainMap.get(u.domain) && (user.adfsUID = `${u.name}${DomainSeperator}${domainMap.get(u.domain)}`);
    //         user.source = u.source;

    //         if (!!mail) user.mail = mail;
    //         return user as IDigitalIdentity;
    //       });
    //     }
    //     if (tPerson.pictures && tPerson.pictures.profile) {
    //       const { format, takenAt, updatedAt } = tPerson.pictures.profile.meta;
    //       tPerson.pictures.profile.meta = {
    //         format,
    //         takenAt,
    //         updatedAt,
    //       };
    //     }
    //     return tPerson;
    //   }
    // }
}

export default new ElasticEntityRepository();
