import config from '../../config/index';
import { IndexSettings } from './indexSettings';

const settings = {};

const roleMapping = {
    properties: {
        jobTitle: {
            type: 'keyword',
        },
        digitalIdentityUniqueId: {
            type: 'keyword',
        },
        directGroup: {
            type: 'keyword',
        },
        hierarchy: {
            type: 'keyword',
        },
        hierarchyIds: {
            type: 'keyword',
        },
        source: {
            type: 'keyword',
        },
        createdAt: {
            type: 'date',
        },
        updatedAt: {
            type: 'date',
        },
    },
};

const indexSettings: IndexSettings = {
    settings,
    mappings: roleMapping,
    name: config.elasticsearch.indexNames.roles,
};

export default indexSettings;
