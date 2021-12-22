/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticRoleRepository from './elasticSearchRepository';
import { RoleFilters, roleMapFieldType } from './textSearchInterface';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { sendToLogger } from '../../rabbit';

export class ElasticRoleController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { roleId, ruleFilters, ...userFilterss } = reqFilters;

        const userFilters: Partial<RoleFilters> = transformQueryToUserFilters(userFilterss);
        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }

            const filteredObject: FilterQueries<Partial<RoleFilters>> = extractFiltersQuery<RoleFilters>(
                ruleFilters as RuleFilter[],
                userFilters,
                roleMapFieldType,
            );

            const response = await ElasticRoleRepository.searchByFullName(roleId!.toString(), filteredObject);
            res.json(response);
        } catch (err) {
            await sendToLogger('error', (err as any).message);
            res.json((err as any).message);
        }
    }
}

export default ElasticRoleController;
