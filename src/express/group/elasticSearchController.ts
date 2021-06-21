import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery } from './textSearchInterface';

export class ElasticGroupController {
    static async searchByFullname(req: Request, res: Response) {
        const groupQueryObj: Partial<GroupQuery> = { name: req.query.fullName?.toString() || '', hierarchy: req.query.hierarchy?.toString() || '' };
        const groupFiltersObj: Partial<GroupFilters> = {};
        // const groupFiltersObj: Partial<GroupFilters> = { underGroupId: req.query?.filters?[0], isAlive: req.query?.filters?[1].toString() === "true" || true };
        const response = await ElasticGroupRepository.searchByNameAndHierarchy(groupQueryObj, groupFiltersObj);
        res.json(response);
    }
}

export default ElasticGroupController;
