import { Response, Request } from 'express';
import { extractDIFiltersQuery } from '../../utils/middlwareHelpers';
import ElasticDIRepository from './elasticSearchRepository';
import { DigitalIdentityFilters } from './textSearchInterface';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const uniqueId: string = req.query!.uniqueId!.toString();
        delete reqFilters.uniqueId;
        const filteredObject: Partial<DigitalIdentityFilters> = extractDIFiltersQuery(reqFilters);
        const response = await ElasticDIRepository.searchByFullName(uniqueId, filteredObject);
        res.json(response);
    }
}

export default ElasticDIController;
