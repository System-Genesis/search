import { Response, Request } from 'express';
import ElasticRoleRepository from './elasticSearchRepository';
import { RoleFilters } from './textSearchInterface';
import { extractRoleFiltersQuery } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';

export class ElasticRoleController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const roleId: string = req.query!.roleId!.toString();
        delete reqFilters.roleId;
        if (typeof reqFilters.ruleFilters === 'string') {
            reqFilters.ruleFilters = JSON.parse(reqFilters.ruleFilters.toString());
        }
        if (typeof reqFilters.userFilters === 'string') {
            reqFilters.userFilters = JSON.parse(reqFilters.userFilters.toString());
        }
        const filteredObject: FilterQueries<Partial<RoleFilters>> = extractRoleFiltersQuery(
            reqFilters.ruleFilters as RuleFilter[],
            reqFilters.userFilters as RuleFilter[],
        );
        const response = await ElasticRoleRepository.searchByFullName(roleId, filteredObject);
        res.json(response);
    }
}

export default ElasticRoleController;
