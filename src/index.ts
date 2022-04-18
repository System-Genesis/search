import Server from './express/server';
import { initializeRabbit } from './rabbit/index';
import config from './config';
import { deleteElasticData, initElasticIndexes, readJsonAndWriteElastic } from './elasticsearch';
import { initializeRabbit } from './rabbit';

const { service } = config;

const main = async () => {
    if (service.isMock) {
        await initializeRabbit();

        await deleteElasticData();
        await initElasticIndexes();
        await readJsonAndWriteElastic(`${process.cwd()}/roles2.json`, config.elasticsearch.indexNames.roles, 'roleId');
        await readJsonAndWriteElastic(`${process.cwd()}/populatedDB.json`, config.elasticsearch.indexNames.entities, 'id');
        await readJsonAndWriteElastic(`${process.cwd()}/diPopulate2.json`, config.elasticsearch.indexNames.digitalIdentities, 'uniqueId');
        await readJsonAndWriteElastic(`${process.cwd()}/ogPopulate2.json`, config.elasticsearch.indexNames.organizationGroups, 'id');
    }

    const server = new Server(service.port);
    await server.start();

    console.log(`Server started on port: ${service.port}`);
};

main().catch((err) => console.error(err));
