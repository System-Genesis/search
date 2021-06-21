import { ElasticSearchBaseRepository } from '../../elasticsearch/elasticSearchBaseRepository';
import { IDigitalIdentity } from './interface';

export class ElasticDIRepository extends ElasticSearchBaseRepository<IDigitalIdentity> {
    static async searchByFullName(fullName: string) {
        return fullName;
        //  return await ElasticDIRepostiory.searchByFullName(fullName);
    }
}

export default ElasticDIRepository;
