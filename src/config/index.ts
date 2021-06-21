import * as env from 'env-var';
import './dotenv';
import * as path from 'path';
import * as fs from 'fs';

const sslEnabled = env.get('ELASTICSEARCH_SSL_ENABLED').default('False').asBool();
const rejectUnauthorized = env.get('ELASTICSEARCH_SSL_REJECT_UNAUTHORIZED').default('False').asBool();
const caPath = env.get('ELASTICSEARCH_SSL_CA_FILE_PATH').default('').asString();
const certPath = env.get('ELASTICSEARCH_SSL_KEY_CERT_PATH').default('').asString();
const keyPath = env.get('ELASTICSEARCH_SSL_KEY_FILE_PATH').default('').asString();
const pfxPath = env.get('ELASTICSEARCH_SSL_PFX_FILE_PATH').default('').asString();
const passphrase = env.get('ELASTICSEARCH_SSL_PASSPHRASE').default('').asString();
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
            enabled: sslEnabled,
            reject_unAuthorized: rejectUnauthorized,
            ca: sslEnabled && rejectUnauthorized && caPath !== '' ? fs.readFileSync(path.resolve(caPath)) : null,
            cert: sslEnabled && certPath !== '' && keyPath !== '' ? fs.readFileSync(path.resolve(certPath)) : null,
            key: sslEnabled && certPath !== '' && keyPath !== '' ? fs.readFileSync(path.resolve(keyPath)) : null,
            pfx: sslEnabled && pfxPath !== '' ? fs.readFileSync(path.resolve(pfxPath)) : null,
            passphrase: sslEnabled && passphrase !== '' ? passphrase : null,
            disableServerIdentityCheck: env.get('ELASTICSEARCH_SSL_DISABLE_SERVER_IDENTITY_CHECK').default('True').asBool(),
        },
        indexNames: {
            entities: 'kartoffelMS.entities',
            organizationGroups: 'kartoffelMS.organizationgroups',
            roles: 'kartoffelMS.roles',
            digitalIdentities: 'kartoffelMS.digitalIdentities',
        },
        defaultResultLimit: 20,
        fullTextFieldMinLength: 2,
        fullTextFieldName: 'autocomplete',
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
