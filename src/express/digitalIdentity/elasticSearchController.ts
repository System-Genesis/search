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
        if (typeof reqFilters.ruleFilters === 'string') {
            reqFilters.ruleFilters = JSON.parse(reqFilters.ruleFilters.toString());
        }
        if (typeof reqFilters.userFilters === 'string') {
            reqFilters.userFilters = JSON.parse(reqFilters.userFilters.toString());
        }
        const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractDIFiltersQuery(
            reqFilters.ruleFilters as RuleFilter[],
            reqFilters.userFilters as RuleFilter[],
        );
        const response = await ElasticDIRepository.searchByFullName(uniqueId, filteredObject);
        res.json(response);
    }
}

export default ElasticDIController;
