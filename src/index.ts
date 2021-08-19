/* eslint-disable no-console */
import * as apm from 'elastic-apm-node';
import Server from './express/server';
import { initializeRabbit } from './rabbit/index';
import config from './config';
import { deleteElasticData, initElasticIndexes, readJsonAndWriteElastic } from './elasticsearch'; //

const { service } = config;

const main = async () => {
    await initializeRabbit();
    const i = 0;
    if (i === 0) {
        await deleteElasticData();
        await initElasticIndexes();

        await readJsonAndWriteElastic(`${process.cwd()}/roles2.json`, config.elasticsearch.indexNames.roles, 'roleId');
        await readJsonAndWriteElastic(`${process.cwd()}/populatedDB.json`, config.elasticsearch.indexNames.entities, 'id');
        await readJsonAndWriteElastic(`${process.cwd()}/diPopulate2.json`, config.elasticsearch.indexNames.digitalIdentities, 'uniqueId');
        await readJsonAndWriteElastic(`${process.cwd()}/ogPopulate2.json`, config.elasticsearch.indexNames.organizationGroups, 'id');
    }

    const server = new Server(service.port);

    await server.start();
    apm.start({
        serviceName: 'search_service',
        serverUrl: `http://localhost:8200`,
    });

    console.log(`Server started on port: ${service.port}`);
    const err = new Error('Ups, something broke2!');

    apm.captureError(err);
};

main().catch((err) => console.error(err));
