/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery, groupMapFieldType } from './textSearchInterface';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { sendToLogger } from '../../rabbit';

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
        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }
            const filteredObject: FilterQueries<Partial<GroupFilters>> = extractFiltersQuery<GroupFilters>(
                ruleFilters as RuleFilter[],
                userFilters,
                groupMapFieldType,
            );

            const response = await ElasticGroupRepository.searchByNameAndHierarchy(groupQueryObj, filteredObject);
            res.json(response);
        } catch (err) {
            await sendToLogger('error', (err as any).message);
            res.json((err as any).message);
        }
    }
}

export default ElasticGroupController;
