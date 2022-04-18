import * as http from 'http';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';

import { once } from 'events';
import { errorMiddleware } from './error';
import appRouter from './router';

class Server {
    public app: express.Application;

    public http: http.Server;

    private port: number;

    constructor(port: number) {
        this.app = Server.createExpressApp();
        this.port = port;
    }

    static createExpressApp() {
        const app = express();
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(logger('dev'));
        app.use(appRouter);
        // app.use(apm.middleware.connect()) MIDDLEWARE COOL STUFF
        app.use(errorMiddleware);

        return app;
    }

    async close() {
        this.http.close();
    }

    async start() {
        this.http = this.app.listen(this.port);
        await once(this.http, 'listening');
    }
}

export default Server;
