/* eslint-disable camelcase */
import config from '../../config/index';
import { IndexSettings } from './indexSettings';
import { analyzers, tokenizersDI, prefix_autocomplete_field_settings, normalizers } from './generalSettings';

const { fullTextFieldName } = config.elasticsearch;
const { autocomplete, autocomplete_search, path_hierarchy } = analyzers;
const { my_normalizer } = normalizers;
const { edge_ngram_tokenizer, custom_path_hierarchy } = tokenizersDI;

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

const DImappings = {
    properties: {
        type: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        source: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        mail: {
            type: 'keyword',
            normalizer: 'my_normalizer',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        uniqueId: {
            type: 'keyword',
            normalizer: 'my_normalizer',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
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
