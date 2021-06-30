import { Router } from 'express';
import ElasticEntityController from './elasticSearchController';
import { wrapController, wrapValidator } from '../../utils/express';
import { getSearchRequestSchema, getPostRequestSchema } from './route.validator';
import { validateSource } from './validator';
import ValidateRequest from '../../utils/joi';

const entityRouter: Router = Router();

entityRouter.get(
    '/search',
    wrapValidator(validateSource),
    ValidateRequest(getSearchRequestSchema),
    wrapController(ElasticEntityController.searchByFullname),
);
entityRouter.post('/entity', ValidateRequest(getPostRequestSchema), wrapController(ElasticEntityController.postEntityElastic));

export default entityRouter;
