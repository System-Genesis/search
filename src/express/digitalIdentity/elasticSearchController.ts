/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import { FilterQueries, RuleFilter } from '../../utils/types';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import ResponseHandler from '../../utils/responseHandler';
import { DigitalIdentityDTO } from './dto';
import ElasticDIRepository from './elasticSearchRepository';
import { DigitalIdentityFilters, digitalIdentityMapFieldType } from './textSearchInterface';

export class ElasticDIController {
    static async searchByUniqueId(req: Request, res: Response) {
        let { uniqueId, ruleFilters, ...userFiltersQuery } = req.query;

        const userFilters: Partial<DigitalIdentityFilters> = transformQueryToUserFilters(userFiltersQuery);
        if (typeof ruleFilters === 'string') {
            ruleFilters = JSON.parse(ruleFilters!.toString());
        }
        const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractFiltersQuery<DigitalIdentityFilters>(
            ruleFilters as RuleFilter[],
            userFilters,
            digitalIdentityMapFieldType,
        );

        const response = await ElasticDIRepository.searchByUniqueId(uniqueId!.toString(), filteredObject);
        ResponseHandler.success<DigitalIdentityDTO[]>(res, response);
    }
}

export default ElasticDIController;
