import { ElasticSearchBaseRepository } from '../../elasticsearch/elasticSearchBaseRepository';
import { IDigitalIdentity } from './interface';

export class ElasticDIRepository extends ElasticSearchBaseRepository<IDigitalIdentity> {
    static async searchByFullName(displayName: string) {
        return displayName;
        //  return await ElasticDIRepostiory.searchByFullName(fullName);
    }
}

export default ElasticDIRepository;
