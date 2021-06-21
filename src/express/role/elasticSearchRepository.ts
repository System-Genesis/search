import { ElasticSearchBaseRepository } from '../../elasticsearch/elasticSearchBaseRepository';
import { IRole } from './interface';

export class ElasticRoleRepository extends ElasticSearchBaseRepository<IRole> {
    static async searchByFullName(fullName: string) {
        return fullName; // await ElasticRoleRepository.searchByFullName(fullName);
    }
}

export default ElasticRoleRepository;
