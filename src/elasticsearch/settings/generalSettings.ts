// eslint-disable-next-line camelcase
export const prefix_autocomplete_field_settings = {
    analyzer: 'autocomplete',
    search_analyzer: 'autocomplete_search',
    type: 'text',
};

export const analyzers = {
    autocomplete: {
        filter: ['lowercase'],
        tokenizer: 'edge_ngram_tokenizer',
        type: 'custom',
    },
    autocomplete_search: {
        tokenizer: 'standard',
        filter: ['lowercase'],
        type: 'custom',
    },
    path_hierarchy: {
        tokenizer: 'custom_path_hierarchy',
    },
};
export const normalizers = {
    my_normalizer: {
        type: 'custom',
        filter: ['lowercase', 'asciifolding'],
    },
};

export const tokenizers = {
    edge_ngram_tokenizer: {
        max_gram: 15,
        min_gram: 2,
        type: 'edge_ngram',
        token_chars: ['letter', 'digit'],
        // custom_token_chars: '+-_',
    },
    custom_path_hierarchy: {
        type: 'path_hierarchy',
        delimeter: '/',
    },
};
export const tokenizersDI = {
    edge_ngram_tokenizer: {
        max_gram: 35,
        min_gram: 2,
        type: 'edge_ngram',
        //  token_chars: ['letter', 'digit'],
        custom_token_chars: '+-_@.',
    },
    custom_path_hierarchy: {
        type: 'path_hierarchy',
        delimeter: '/',
    },
};
