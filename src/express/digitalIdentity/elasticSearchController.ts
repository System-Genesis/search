/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import { FilterQueries, RuleFilter } from '../../utils/types';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import ResponseHandler from '../../utils/responseHandler';
import { DigitalIdentityDTO } from './dto';
import ElasticDIRepository from './elasticSearchRepository';
import * as ApiErrors from '../../core/ApiErrors';
import { DigitalIdentityFilters, digitalIdentityMapFieldType } from './textSearchInterface';

export class ElasticDIController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { uniqueId, ruleFilters, ...userFilterss } = reqFilters;

        const userFilters: Partial<DigitalIdentityFilters> = transformQueryToUserFilters(userFilterss);

        if (typeof reqFilters.ruleFilters === 'string') {
            ruleFilters = JSON.parse(ruleFilters!.toString());
        }

        const filteredObject: FilterQueries<Partial<DigitalIdentityFilters>> = extractFiltersQuery<DigitalIdentityFilters>(
            ruleFilters as RuleFilter[],
            userFilters,
            digitalIdentityMapFieldType,
        );

        const response = await ElasticDIRepository.searchByFullName(uniqueId!.toString(), filteredObject);
        if (!response) {
            throw new ApiErrors.NotFoundError();
        }
        ResponseHandler.success<DigitalIdentityDTO[]>(res, response);
    }
}

export default ElasticDIController;
