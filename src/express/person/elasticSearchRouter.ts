import { Router } from 'express';
import ElasticPersonController from './elasticSearchController';
import { wrapController, wrapValidator } from '../../utils/express';

const personRouter: Router = Router();

personRouter.get('/searchByFullName', wrapController(ElasticPersonController.searchByFullname);

export default personRouter;
