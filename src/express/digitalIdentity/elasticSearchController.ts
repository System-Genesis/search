import { Response, Request } from 'express';
import { FilterQueries, RuleFilter } from '../../types';
import { extractDIFiltersQuery } from '../../utils/middlwareHelpers';
import ElasticDIRepository from './elasticSearchRepository';
import { DigitalIdentityFilters } from './textSearchInterface';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const uniqueId: string = req.query!.uniqueId!.toString();
        delete reqFilters.uniqueId;
        const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractDIFiltersQuery(
            reqFilters.ruleFilters as RuleFilter[],
            reqFilters.userFilters as RuleFilter[],
        );
        const response = await ElasticDIRepository.searchByFullName(uniqueId, filteredObject);
        res.json(response);
    }
}

export default ElasticDIController;
