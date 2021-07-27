/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticGroupRepository from './elasticSearchRepository';
import { GroupFilters, GroupQuery } from './textSearchInterface';
import { extractGroupFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { sendToLogger } from '../../rabbit';

export class ElasticGroupController {
    static async searchByFullname(req: Request, res: Response) {
        const groupQueryObj: Partial<GroupQuery> = { name: req.query.name!.toString(), hierarchy: req.query.hierarchy?.toString() || '' };
        const reqFilters = req.query;
        delete reqFilters.name;
        delete reqFilters.hierarchy;
        let { ruleFilters, ...userFilterss } = reqFilters;

        console.log(ruleFilters!);
        const userFilters: Partial<GroupFilters> = transformQueryToUserFilters(userFilterss);
        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }
            const filteredObject: FilterQueries<Partial<GroupFilters>> = extractGroupFiltersQuery(ruleFilters as RuleFilter[], userFilters);

            const response = await ElasticGroupRepository.searchByNameAndHierarchy(groupQueryObj, filteredObject);
            res.json(response);
        } catch (err) {
            await sendToLogger('error', err.message);
            res.json(err.message);
        }
    }
}

export default ElasticGroupController;
