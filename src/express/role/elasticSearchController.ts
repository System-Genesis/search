/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticRoleRepository from './elasticSearchRepository';
import { RoleFilters } from './textSearchInterface';
import { extractRoleFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { sendToLogger } from '../../rabbit';

export class ElasticRoleController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const roleId: string = req.query!.roleId!.toString();
        delete reqFilters.roleId;
        let { ruleFilters, ...userFilterss } = req.query;

        const userFilters: Partial<RoleFilters> = transformQueryToUserFilters(userFilterss);
        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }

            const filteredObject: FilterQueries<Partial<RoleFilters>> = extractRoleFiltersQuery(ruleFilters as RuleFilter[], userFilters);

            const response = await ElasticRoleRepository.searchByFullName(roleId, filteredObject);
            res.json(response);
        } catch (err) {
            await sendToLogger('error', err.message);
            res.json(err.message);
        }
    }
}

export default ElasticRoleController;
