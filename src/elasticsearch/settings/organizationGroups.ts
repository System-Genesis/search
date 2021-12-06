/* eslint-disable camelcase */
import config from '../../config/index';
import { IndexSettings } from './indexSettings';

import { analyzers, tokenizers, prefix_autocomplete_field_settings } from './generalSettings';

const { fullTextFieldName } = config.elasticsearch;

const { autocomplete, autocomplete_search } = analyzers;
const { edge_ngram_tokenizer } = tokenizers;

const settings = {
    analysis: {
        analyzer: {
            autocomplete,
            autocomplete_search,
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
        // TO DO: remove it after noam finishes
        // directEntities: {
        //     enabled: false,
        // },
        // directRole: {
        //     enabled: false,
        // },
    },
};

const indexSettings: IndexSettings = {
    settings,
    mappings: mappingsOG,
    name: config.elasticsearch.indexNames.organizationGroups,
};

export default indexSettings;
