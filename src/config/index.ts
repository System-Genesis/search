import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
    },
    elasticsearch: {
        indexInitRetries: 3,
        nodes: env.get('ELASTICSEARCH_HOSTS').required().asString().split(','),
        auth: {
            username: env.get('ELASTICSEARCH_USERNAME').required().asString(),
            password: env.get('ELASTICSEARCH_PASSWORD').required().asString(),
        },
        ssl: {
            enabled: env.get('ELASTICSEARCH_SSL_ENABLED').default('False').asBool(),
            reject_unAuthorized: env.get('ELASTICSEARCH_SSL_REJECT_UNAUTHORIZED').default('False').asBool(),
            cert: env.get('ELASTICSEARCH_CERTIFICATE_FILE_PATH').default('').asString(),
            key: env.get('ELASTICSEARCH_KEY_FILE_PATH').default('').asString(),
            pfx: env.get('ELASTICSEARCH_SSL_PFX_FILE_PATH').default('').asString(),
            passphrase: env.get('ELASTICSEARCH_SSL_PASSPHRASE').default('').asString(),
            disableServerIdentityCheck: env.get('ELASTICSEARCH_SSL_DISABLE_SERVER_IDENTITY_CHECK').default('True').asBool(),
        },
        indexNames: {
            persons: 'kartoffel.people',
            organizationGroups: 'kartoffel.organizationgroups',
            roles: 'kartoffel.roles',
            domainUsers: 'kartoffel.domainUsers',
        },
        defaultResultLimit: 20,
        fullTextFieldMinLength: 2,
    },
    mongo: {
        uri: env.get('MONGO_URI').required().asUrlString(),
        featureCollectionName: env.get('MONGO_FEATURE_COLLECTION_NAME').required().asString(),
    },
    rabbit: {
        uri: env.get('RABBIT_URI').required().asUrlString(),
        retryOptions: {
            minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
            retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
            factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
        },
    },
};

export default config;
