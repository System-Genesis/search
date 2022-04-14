import elasticClient from '../elasticsearch/elasticSearchClientConfiguration';

export default async () => {
    try {
        await elasticClient.ping();
        return true;
    } catch (e) {
        return false;
    }
};
