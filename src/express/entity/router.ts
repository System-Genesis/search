import { Router } from 'express';
import ElasticPersonController from './elasticSearchController';
import { wrapController } from '../../utils/express'; // wrapValidator
import { getSearchRequestSchema } from './route.validator';
import ValidateRequest from '../../utils/joi';

const entityRouter: Router = Router();

entityRouter.get('/search', ValidateRequest(getSearchRequestSchema), wrapController(ElasticPersonController.searchByFullname));

export default entityRouter;
