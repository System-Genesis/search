// eslint-disable-next-line camelcase
export const prefix_autocomplete_field_settings = {
    analyzer: 'autocomplete',
    search_analyzer: 'autocomplete_search',
    type: 'text',
};

export const analyzers = {
    // on tokneizing, breaks stream of characters into invidual tokens,
    autocomplete: {
        filter: ['lowercase'],
        tokenizer: 'edge_ngram_tokenizer',
        type: 'custom',
    },
    // search stop words: if you search: I love dance, and in db there is "love","dance","ilove dance" it will return all of them
    autocomplete_search: {
        tokenizer: 'standard',
        filter: ['lowercase'],
        type: 'custom',
    },
    path_hierarchy: {
        tokenizer: 'custom_path_hierarchy', // tokenizing by hierarchy (for group search)
    },
};
// normalizer: allow lower search terms queries: Es_NAme will be considered as es_name on search. makes the db slower.
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
        custom_token_chars: '+-_@.',
    },
    // TODO: remove following
    custom_path_hierarchy: {
        type: 'path_hierarchy',
        delimeter: '/',
    },
};
