import { Response, Request } from 'express';
import { ElasticRoleRepository } from './elasticSearchRepository';

export class ElasticRoleController {
    static async searchByFullname(req: Request, res: Response) {
        const response = await ElasticRoleRepository.searchByFullName(req.query?.fullName?.toString() || '');
        res.json(response);
    }
}

export default ElasticRoleController;
