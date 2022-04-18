import { Router } from 'express';
import { ElasticGroupController } from './elasticSearchController';
import { wrapController } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { getSearchRequestSchema } from './route.validator';

const groupRouter: Router = Router();

groupRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticGroupController.searchByNameAndHierarchy));

export default groupRouter;
