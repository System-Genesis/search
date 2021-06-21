import { Router } from 'express';
import { ElasticGroupController } from './elasticSearchController';
import { wrapController } from '../../utils/express'; // wrapValidator

const groupRouter: Router = Router();

groupRouter.get('/search', wrapController(ElasticGroupController.searchByFullname));

export default groupRouter;
