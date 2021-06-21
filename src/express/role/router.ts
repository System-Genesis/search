import { Router } from 'express';
import { ElasticRoleController } from './elasticSearchController';
import { wrapController } from '../../utils/express'; // wrapValidator

const roleRouter: Router = Router();

roleRouter.get('/search', wrapController(ElasticRoleController.searchByFullname));

export default roleRouter;
