import { Router } from 'express';
import ElasticEntityController from './elasticSearchController';
import { wrapController } from '../../utils/express';
import { getSearchRequestSchema, getPostRequestSchema, validateOneExistence } from './route.validator';

import ValidateRequest from '../../utils/joi';

const entityRouter: Router = Router();
// TODO (RN) - Fullname => FullName
entityRouter.get(
    '/search',
    ValidateRequest(getSearchRequestSchema),
    ValidateRequest(validateOneExistence),
    wrapController(ElasticEntityController.searchByFullname),
);
entityRouter.post('/entity', ValidateRequest(getPostRequestSchema), wrapController(ElasticEntityController.postEntityElastic));

export default entityRouter;
