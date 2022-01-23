/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery, groupMapFieldType } from './textSearchInterface';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { GroupDTO } from './dto';
import ResponseHandler from '../../utils/responseHandler';

export class ElasticGroupController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { name, hierarchy, nameAndHierarchy, ruleFilters, ...userFiltersQuery } = reqFilters;
        const groupQueryObj: Partial<GroupQuery> = {
            name: req.query.name?.toString(),
            hierarchy: req.query.hierarchy?.toString(),
            nameAndHierarchy: nameAndHierarchy?.toString(),
        };
        const userFilters: Partial<GroupFilters> = transformQueryToUserFilters(userFiltersQuery);

        if (typeof reqFilters.ruleFilters === 'string') {
            ruleFilters = JSON.parse(ruleFilters!.toString());
        }
        const filteredObject: FilterQueries<Partial<GroupFilters>> = extractFiltersQuery<GroupFilters>(
            ruleFilters as RuleFilter[],
            userFilters,
            groupMapFieldType,
        );

        const response = await ElasticGroupRepository.searchByNameAndHierarchy(groupQueryObj, filteredObject);
        ResponseHandler.success<GroupDTO[]>(res, response);
    }
}

export default ElasticGroupController;
