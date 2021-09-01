/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import { sendToLogger } from '../../rabbit';
import { FilterQueries, RuleFilter } from '../../types';
import { extractDIFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import ElasticDIRepository from './elasticSearchRepository';
import { DigitalIdentityFilters } from './textSearchInterface';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { uniqueId, ruleFilters, ...userFilterss } = reqFilters;

        const userFilters: Partial<DigitalIdentityFilters> = transformQueryToUserFilters(userFilterss);

        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }

            const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractDIFiltersQuery(ruleFilters as RuleFilter[], userFilters);

            const response = await ElasticDIRepository.searchByFullName(uniqueId!.toString(), filteredObject);

            res.json(response);
        } catch (err) {
            await sendToLogger('error', err.message);
            res.json(err.message);
        }
    }
}

export default ElasticDIController;
