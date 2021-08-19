import menash from 'menashmq';
import config from '../config/index';

const { rabbit } = config;

export const initializeRabbit = async () => {
    console.log('Connecting to Rabbit...');
    await menash.connect(rabbit.uri, rabbit.retryOptions);
    console.log('Rabbit connected');

    await menash.declareTopology({
        queues: [{ name: rabbit.loggerQueueName, options: { durable: true } }],
    });
    console.log('Rabbit initialized');
};

export const sendToLogger = async (level: string, message: string, extraFields?: any) => {
    await menash.send(rabbit.loggerQueueName, { level, message, system: 'kartoffel', service: 'search', extraFields });
};

export default { initializeRabbit, sendToLogger };
