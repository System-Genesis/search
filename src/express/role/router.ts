import { Router } from 'express';
import { ElasticRoleController } from './elasticSearchController';
import { wrapController } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { getSearchRequestSchema } from './route.validator';

const roleRouter: Router = Router();

roleRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticRoleController.searchByRoleId));

export default roleRouter;
