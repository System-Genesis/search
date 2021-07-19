import { Router } from 'express';
import { ElasticGroupController } from './elasticSearchController';
import { wrapController } from '../../utils/express'; // wrapValidator
import ValidateRequest from '../../utils/joi';
import { getSearchRequestSchema } from './route.validator';

const groupRouter: Router = Router();

groupRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticGroupController.searchByFullname));

export default groupRouter;
