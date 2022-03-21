/* eslint-disable camelcase */
import config from '../../config/index';
import { IndexSettings } from './indexSettings';

import { analyzers, tokenizers, prefix_autocomplete_field_settings, normalizers } from './generalSettings';

const { fullTextFieldName } = config.elasticsearch;
const { my_normalizer } = normalizers;
const { autocomplete, autocomplete_search } = analyzers;
const { edge_ngram_tokenizer } = tokenizers;

const settings = {
    analysis: {
        analyzer: {
            autocomplete,
            autocomplete_search,
        },
        normalizer: {
            my_normalizer,
        },
        tokenizer: {
            edge_ngram_tokenizer,
        },
    },
};

const mappingsOG = {
    properties: {
        id: {
            enabled: false,
        },
        name: {
            type: 'keyword',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        // TODO: remove fields
        akaUnit: {
            type: 'keyword',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        hierarchy: {
            type: 'keyword',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        ancestors: {
            type: 'keyword',
        },
        source: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        status: {
            type: 'keyword',
        },
        isLeaf: {
            type: 'boolean',
        },
        createdAt: {
            type: 'date',
        },
        updatedAt: {
            type: 'date',
        },
        diPrefix: {
            type: 'keyword',
        },

        // TO DO: remove it after noam finishes
        directEntities: {
            enabled: false,
        },
        directRole: {
            enabled: false,
        },
    },
};

const indexSettings: IndexSettings = {
    settings,
    mappings: mappingsOG,
    name: config.elasticsearch.indexNames.organizationGroups,
};

export default indexSettings;
