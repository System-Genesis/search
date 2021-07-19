/* eslint-disable no-console */
import * as mongoose from 'mongoose';
import menash, { ConsumerMessage } from 'menashmq';
import Server from './express/server';
import config from './config';
import { deleteElasticData, initElasticIndexes, readJsonAndWriteElastic } from './elasticsearch'; //

const { mongo, rabbit, service } = config;

const initializeMongo = async () => {
    await mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
};

const initializeRabbit = async () => {
    console.log('Connecting to Rabbit...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);

    console.log('Rabbit connected');

    const featureConsumeFunction = (msg: ConsumerMessage) => {
        console.log('Received message: ', msg.getContent());
    };

    await menash.declareTopology({
        queues: [{ name: 'feature-queue', options: { durable: true } }],
        exchanges: [{ name: 'feature-exchange', type: 'fanout', options: { durable: true } }],
        bindings: [{ source: 'feature-exchange', destination: 'feature-queue' }],
        consumers: [{ queueName: 'feature-queue', onMessage: featureConsumeFunction }],
    });

    console.log('Rabbit initialized');
};

const main = async () => {
    const i = 0;
    if (i !== 0) {
        await initializeMongo();
        // dsadsasds
        await initializeRabbit();
        await deleteElasticData();
        await initElasticIndexes();
        await readJsonAndWriteElastic(`${process.cwd()}/roles2.json`, config.elasticsearch.indexNames.roles, 'roleId');
        await readJsonAndWriteElastic(`${process.cwd()}/populatedDB.json`, config.elasticsearch.indexNames.entities, 'id');
        await readJsonAndWriteElastic(`${process.cwd()}/diPopulate2.json`, config.elasticsearch.indexNames.digitalIdentities, 'uniqueId');
        await readJsonAndWriteElastic(`${process.cwd()}/ogPopulate2.json`, config.elasticsearch.indexNames.organizationGroups, 'id');
    }
    process.once('SIGUSR2', () => {
        process.kill(process.pid, 'SIGUSR2');
    });

    process.on('SIGINT', () => {
        // this is only called on ctrl+c, not restart
        process.kill(process.pid, 'SIGINT');
    });

    const server = new Server(service.port);

    await server.start();

    console.log(`Server started on port: ${service.port}`);
};

main().catch((err) => console.error(err));
