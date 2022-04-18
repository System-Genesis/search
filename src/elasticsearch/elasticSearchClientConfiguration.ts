import { Client, ClientOptions } from '@elastic/elasticsearch';
import { ConnectionOptions } from 'tls';
import config from '../config/index';

export const configureElasticOptions = (): ClientOptions => {
    const { nodes, ssl, auth } = config.elasticsearch;
    const opts: ClientOptions = {
        nodes,
    };

    // add ssl opt
    if (ssl.enabled) {
        const sslOpts: ConnectionOptions = {
            rejectUnauthorized: ssl.reject_unAuthorized,
        };
        // add ca
        if (ssl.ca) sslOpts.ca = ssl.ca;
        // add pfx OR cert (priority to PFX)
        if (ssl.pfx) sslOpts.pfx = ssl.pfx;
        else if (ssl.cert) {
            sslOpts.cert = ssl.cert;
            if (ssl.key) sslOpts.key = ssl.key;
        }
        // add passphrase
        if (ssl.passphrase) sslOpts.passphrase = ssl.passphrase;
        // check whether to disable server identity check
        if (ssl.disableServerIdentityCheck) {
            sslOpts.checkServerIdentity = (_, __) => undefined;
        }
        opts.ssl = sslOpts;
    }
    // add auth opts
    if (auth.username) {
        opts.auth = {
            username: auth.username,
            password: auth.password,
        };
    }
    return opts;
};
const clientConf = new Client(configureElasticOptions());
export default clientConf;
