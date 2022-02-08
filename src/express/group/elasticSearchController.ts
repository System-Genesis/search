/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery, groupMapFieldType } from './textSearchInterface';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../utils/types';
import { GroupDTO } from './dto';
import ResponseHandler from '../../utils/responseHandler';

export class ElasticGroupController {
    static async searchByNameAndHierarchy(req: Request, res: Response) {
        let { name, hierarchy, nameAndHierarchy, ruleFilters, ...userFiltersQuery } = req.query;
        const groupQueryObj: Partial<GroupQuery> = {
            name: name?.toString(),
            hierarchy: hierarchy?.toString(),
            nameAndHierarchy: nameAndHierarchy?.toString(),
        };

        const userFilters: Partial<GroupFilters> = transformQueryToUserFilters(userFiltersQuery);
        if (typeof ruleFilters === 'string') {
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
