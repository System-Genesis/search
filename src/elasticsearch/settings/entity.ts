/* eslint-disable camelcase */
import config from '../../config/index';
import { IndexSettings } from './indexSettings';
import { analyzers, tokenizers, prefix_autocomplete_field_settings, normalizers } from './generalSettings';

const { fullTextFieldName } = config.elasticsearch;
const { autocomplete, autocomplete_search, path_hierarchy } = analyzers;
const { my_normalizer } = normalizers;
const { edge_ngram_tokenizer, custom_path_hierarchy } = tokenizers;

const settings = {
    analysis: {
        analyzer: {
            autocomplete,
            autocomplete_search,
            path_hierarchy,
        },
        normalizer: {
            my_normalizer,
        },
        tokenizer: {
            edge_ngram_tokenizer,
            custom_path_hierarchy,
        },
    },
};

const entityMappings = {
    properties: {
        id: {
            enabled: false,
        },
        goalUserId: {
            type: 'keyword',
        },
        // TODO: delete fields
        displayName: {
            type: 'keyword',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        fullName: {
            type: 'keyword',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        entityType: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        identityCard: {
            type: 'keyword',
        },
        personalNumber: {
            type: 'keyword',
        },
        firstName: {
            enabled: false,
        },
        lastName: {
            enabled: false,
        },
        akaUnit: {
            enabled: false,
        },
        status: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        dischargeDay: {
            type: 'date',
        },
        hierarchy: {
            type: 'keyword',
        },
        // TODO: delete it
        hierarchyPath: {
            type: 'text',
            analyzer: 'path_hierarchy',
        },
        rank: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        mail: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        job: {
            enabled: false,
        },
        phone: {
            enabled: false,
        },
        mobilePhone: {
            enabled: false,
        },
        address: {
            enabled: false,
        },
        clearance: {
            enabled: false,
        },
        pictures: {
            properties: {
                profile: {
                    properties: {
                        url: { enabled: false },
                        meta: {
                            properties: {
                                takenAt: { enabled: false },
                                updatedAt: { enabled: false },
                                format: { enabled: false },
                                path: { enabled: false },
                            },
                        },
                    },
                },
            },
        },
        sex: {
            enabled: false,
        },
        birthDate: {
            type: 'date',
        },
        createdAt: {
            enabled: false,
        },
        updatedAt: {
            type: 'date',
        },
        digitalIdentities: {
            properties: {
                type: {
                    type: 'keyword',
                },
                source: {
                    type: 'keyword',
                    normalizer: 'my_normalizer',
                },
                mail: {
                    type: 'keyword',
                    normalizer: 'my_normalizer',
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
                upn: {
                    type: 'keyword',
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
        },
    },
};

const indexSettings: IndexSettings = {
    settings,
    mappings: entityMappings,
    name: config.elasticsearch.indexNames.entities,
};

export default indexSettings;
