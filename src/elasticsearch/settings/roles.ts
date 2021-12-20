/* eslint-disable camelcase */
import config from '../../config/index';
import { IndexSettings } from './indexSettings';

import { analyzers, prefix_autocomplete_field_settings, normalizers, tokenizersDI } from './generalSettings';

const { fullTextFieldName } = config.elasticsearch;
const { autocomplete, autocomplete_search, path_hierarchy } = analyzers;
const { edge_ngram_tokenizer, custom_path_hierarchy } = tokenizersDI;
const { my_normalizer } = normalizers;

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

const roleMapping = {
    properties: {
        jobTitle: {
            type: 'keyword',
            normalizer: 'my_normalizer',
        },
        roleId: {
            type: 'keyword',
            normalizer: 'my_normalizer',
            fields: {
                [fullTextFieldName]: prefix_autocomplete_field_settings,
            },
        },
        directGroup: {
            type: 'keyword',
        },
        hierarchy: {
            type: 'text',
            analyzer: 'path_hierarchy',
        },
        hierarchyIds: {
            type: 'keyword',
        },
        source: {
            type: 'keyword',
            normalizer: 'my_normalizer',
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
