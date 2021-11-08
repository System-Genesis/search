import { Router } from 'express';
import entityRouter from './entity/router';
import groupRouter from './group/router';
import DIRouter from './digitalIdentity/router';
import roleRouter from './role/router';

const appRouter = Router();

appRouter.use('/api/entities', entityRouter);
appRouter.use('/api/groups', groupRouter);
appRouter.use('/api/digitalIdentities', DIRouter);
appRouter.use('/api/roles', roleRouter);
appRouter.use('/isAlive', (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});

export default appRouter;
