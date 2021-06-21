import { Response, Request } from 'express';
import ElasticEntityRepository from './elasticSearchRepository';
import { IEntity } from './interface';
import { EntityFilters } from './textSearchInterface';

export class ElasticEntityController {
    static async searchByFullname(req: Request, res: Response) {
        const na: Partial<EntityFilters> = {};
        const response = await ElasticEntityRepository.searchByFullName(req.query?.fullName?.toString() || '', na);
        res.json(response);
    }

    static async getEntityById(entityId: string): Promise<IEntity> {
        const entity = await ElasticEntityRepository.findById(entityId);
        if (!entity) {
            throw new Error(`Cannot find entity with ID: ${entityId}`);
        }
        return entity;
    }
}

export default ElasticEntityController;
