import { Response, Request } from 'express';
import ElasticRoleRepository from './elasticSearchRepository';
import { RoleFilters } from './textSearchInterface';
import { extractRoleFiltersQuery } from '../../utils/middlwareHelpers';

export class ElasticRoleController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const roleId: string = req.query!.roleId!.toString();
        delete reqFilters.roleId;
        const filteredObject: Partial<RoleFilters> = extractRoleFiltersQuery(reqFilters);
        const response = await ElasticRoleRepository.searchByFullName(roleId, filteredObject);
        res.json(response);
    }
}

export default ElasticRoleController;
