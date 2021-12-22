/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import { sendToLogger } from '../../rabbit';
import { FilterQueries, RuleFilter } from '../../types';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import ElasticDIRepository from './elasticSearchRepository';
import { DigitalIdentityFilters, digitalIdentityMapFieldType } from './textSearchInterface';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { uniqueId, ruleFilters, ...userFilterss } = reqFilters;

        const userFilters: Partial<DigitalIdentityFilters> = transformQueryToUserFilters(userFilterss);

        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }

            const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractFiltersQuery<DigitalIdentityFilters>(
                ruleFilters as RuleFilter[],
                userFilters,
                digitalIdentityMapFieldType,
            );

            const response = await ElasticDIRepository.searchByFullName(uniqueId!.toString(), filteredObject);

            res.json(response);
        } catch (err) {
            await sendToLogger('error', (err as any).message);
            res.json((err as any).message);
        }
    }
}

export default ElasticDIController;
