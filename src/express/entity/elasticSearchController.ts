import { Response, Request } from 'express';
import * as qs from 'qs';
import ElasticEntityRepository from './elasticSearchRepository';
import { IEntity } from './interface';
import { EntityFilters } from './textSearchInterface';
import { extractEntityFiltersQuery } from '../../utils/middlwareHelpers';
import { FilterQueries, RuleFilter } from '../../types';

export class ElasticEntityController {
    static async searchByFullname(req: Request, res: Response) {
        const reqFilters = req.query;
        const fullName: string = req.query!.fullName!.toString();
        delete reqFilters.fullName;
        if (typeof reqFilters.ruleFilters === 'string') {
            reqFilters.ruleFilters = qs.parse(JSON.parse(JSON.stringify(reqFilters.ruleFilters.toString())));
            console.log(reqFilters.ruleFilters);
        }
        if (typeof reqFilters.userFilters === 'string') {
            reqFilters.userFilters = qs.parse(JSON.parse(JSON.stringify(reqFilters.userFilters.toString())));
        }
        const filteredObject: FilterQueries<Partial<EntityFilters>> = extractEntityFiltersQuery(
            reqFilters.ruleFilters as RuleFilter[],
            reqFilters.userFilters as RuleFilter[],
        );
        const response = await ElasticEntityRepository.searchByFullName(fullName, filteredObject);
        res.json(response);
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
