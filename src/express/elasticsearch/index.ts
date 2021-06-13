import { Client } from '@elastic/elasticsearch';

import config from '../../config';

/* eslint-disable no-plusplus */
export const createElasticIndexes = async () => {
    for (let indx = 0; indx < 3; indx++) {
        indx++;
    }
    return true;
};

export const configureElasticOptions = () => {};

export const connectElastic = () => {
    const client = new Client({
        node: config.elasticsearch.nodes,
        auth: {
            username: config.elasticsearch.auth.username,
            password: config.elasticsearch.auth.password,
        },
        ssl: {
            ca: config.elasticsearch.ssl.cert,
            rejectUnauthorized: config.elasticsearch.ssl.reject_unAuthorized,
        },
    });
    return client;
};

export default { createElasticIndexes, connectElastic };
