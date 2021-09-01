/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticEntityRepository from './elasticSearchRepository';
import { IEntity } from './interface';
import { EntityFilters } from './textSearchInterface';
import { extractEntityFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';
import { sendToLogger } from '../../rabbit';

export class ElasticEntityController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        let { fullName, ruleFilters, ...userFilterss } = reqFilters;
        const userFilters: Partial<EntityFilters> = transformQueryToUserFilters(userFilterss);

        try {
            if (typeof reqFilters.ruleFilters === 'string') {
                ruleFilters = JSON.parse(ruleFilters!.toString());
            }
            const filteredObject: FilterQueries<Partial<EntityFilters>> = extractEntityFiltersQuery(ruleFilters as RuleFilter[], userFilters);
            const response = await ElasticEntityRepository.searchByFullName(fullName!.toString(), filteredObject);
            res.json(response);
        } catch (err) {
            await sendToLogger('error', err.message);
            res.json(err.message);
        }
    }

    static async getEntityById(entityId: string): Promise<IEntity> {
        const entity = await ElasticEntityRepository.findById(entityId);
        if (!entity) {
            throw new Error(`Cannot find entity with ID: ${entityId}`);
        }
        return entity;
    }

    static async postEntityElastic(req: Request, res: Response) {
        await ElasticEntityRepository.insertElastic(req.body);
        res.json('added successfully');
    }
}

export default ElasticEntityController;
