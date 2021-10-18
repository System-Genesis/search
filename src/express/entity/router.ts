import { Router } from 'express';
import ElasticEntityController from './elasticSearchController';
import { wrapController } from '../../utils/express';
import { getSearchRequestSchema, getPostRequestSchema } from './route.validator';

import ValidateRequest from '../../utils/joi';

const entityRouter: Router = Router();

entityRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticEntityController.searchByFullname));
entityRouter.post('/entity', ValidateRequest(getPostRequestSchema), wrapController(ElasticEntityController.postEntityElastic));

export default entityRouter;
