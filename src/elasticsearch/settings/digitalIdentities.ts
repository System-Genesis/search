import config from '../../config/index';
import { IndexSettings } from './indexSettings';

export type DigitalIdentity = {
    type: string;
    source: string;
    mail: string;
    uniqueId: string;
    entityId: string;
    createdAt: Date;
    updatedAt: Date;
    isRoleAttachable: boolean;
    // role: {
    //     roleId: string;
    //     jobTitle: string;
    //     directGroup: string;
    //     hierarchy: string;
    //     hierarchyIds: string[];
    //     source: string;
    //     createdAt: Date;
    //     updatedAt: Date;
    // };
};
const settings = {};

const DImappings = {
    properties: {
        type: {
            type: 'keyword',
        },
        source: {
            type: 'keyword',
        },
        mail: {
            type: 'keyword',
        },
        uniqueId: {
            type: 'keyword',
        },
        entityId: {
            type: 'keyword',
        },
        createdAt: {
            type: 'date',
        },
        updatedAt: {
            type: 'date',
        },
        isRoleAttachable: {
            type: 'boolean',
        },
        role: {
            properties: {
                roleId: {
                    enabled: false,
                },
                jobTitle: {
                    enabled: false,
                },
                directGroup: {
                    enabled: false,
                },
                hierarchy: {
                    enabled: false,
                },
                hierarchyIds: {
                    enabled: false,
                },
                source: {
                    enabled: false,
                },
                createdAt: {
                    enabled: false,
                },
                updatedAt: {
                    enabled: false,
                },
            },
        },
    },
};

const indexSettings: IndexSettings = {
    settings,
    mappings: DImappings,
    name: config.elasticsearch.indexNames.digitalIdentities,
};

export default indexSettings;
