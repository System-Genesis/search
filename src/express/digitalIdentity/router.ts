import { Router } from 'express';
import ElasticDIController from './elasticSearchController';
import { wrapController } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { getSearchRequestSchema } from './router.validator';

const DIRouter: Router = Router();

DIRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticDIController.searchByUniqueId));

export default DIRouter;
