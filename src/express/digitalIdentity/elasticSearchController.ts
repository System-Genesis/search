import { Response, Request } from 'express';
import { ElasticDIRepository } from './elasticSearchRepository';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const response = await ElasticDIRepository.searchByFullName(req.body.fullName.toString());
        res.json(response);
    }
}

export default ElasticDIController;
