import { Router } from 'express';
import ElasticDIController from './elasticSearchController';
import { wrapController } from '../../utils/express'; // wrapValidator

const DIRouter: Router = Router();

DIRouter.get('/search', wrapController(ElasticDIController.searchByFullname));

export default DIRouter;
