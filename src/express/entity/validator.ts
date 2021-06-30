import { Request } from 'express';
import { DATA_SOURCE } from '../../config/db-enums';

export const validateSource = async (_req: Request) => {
    if (_req.query.source !== undefined) {
        if (DATA_SOURCE.indexOf(_req.query.source as string) === -1) {
            throw new Error('Datasource does not exist in config!');
        }
    }
};

export default { validateSource };
