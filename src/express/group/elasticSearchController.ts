import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery } from './textSearchInterface';
import { extractGroupFiltersQuery } from '../../utils/middlwareHelpers';

export class ElasticGroupController {
    static async searchByFullname(req: Request, res: Response) {
        const groupQueryObj: Partial<GroupQuery> = { name: req.query.name!.toString(), hierarchy: req.query.hierarchy?.toString() || '' };
        const reqFilters = req.query;
        delete reqFilters.name;
        delete reqFilters.hierarchy;
        const filteredObject: Partial<GroupFilters> = extractGroupFiltersQuery(reqFilters);

        const response = await ElasticGroupRepository.searchByNameAndHierarchy(groupQueryObj, filteredObject);
        res.json(response);
    }
}

export default ElasticGroupController;
