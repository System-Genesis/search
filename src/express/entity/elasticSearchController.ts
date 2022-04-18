/* eslint-disable prefer-const */
import { Response, Request } from 'express';
import ElasticEntityRepository from './elasticSearchRepository';
import { EntityFilters, entityMapFieldType } from './textSearchInterface';
import { extractFiltersQuery, transformQueryToUserFilters } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../utils/types';
import { IEntity } from './interface';
import ResponseHandler from '../../utils/responseHandler';
import { EntityDTO } from './dto';

export class ElasticEntityController {
    static async searchByFullname(req: Request, res: Response) {
        let { fullName, ruleFilters, ...userFiltersQuery } = req.query;
        const userFilters: Partial<EntityFilters> = transformQueryToUserFilters<EntityFilters>(userFiltersQuery);

        // TODO (RN) - Is it relevant now? leftover from querystring?
        if (typeof ruleFilters === 'string') {
            ruleFilters = JSON.parse(ruleFilters!.toString());
        }
        const filteredObject: FilterQueries<Partial<EntityFilters>> = extractFiltersQuery<EntityFilters>(
            ruleFilters as RuleFilter[],
            userFilters,
            entityMapFieldType,
        );
        const response = await ElasticEntityRepository.searchByFullName(fullName!.toString(), filteredObject);
        ResponseHandler.success<EntityDTO[]>(res, response);
    }

    // TODO (RN) - Should be here? maybe insert to repo directly, following function doesnt take req arg
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
