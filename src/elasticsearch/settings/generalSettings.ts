// export const settingsGeneral = {
//     settings: {
//         index: {
//             analysis: {
//                 filter: {},
//                 analyzer: {
//                     keyword_analyzer: {
//                         filter: ['lowercase', 'asciifolding', 'trim'],
//                         char_filter: [],
//                         type: 'custom',
//                         tokenizer: 'keyword',
//                     },
//                     edge_ngram_analyzer: {
//                         filter: ['lowercase'],
//                         tokenizer: 'edge_ngram_tokenizer',
//                     },
//                     edge_ngram_search_analyzer: {
//                         tokenizer: 'lowercase',
//                     },
//                 },
//                 tokenizer: {
//                     edge_ngram_tokenizer: {
//                         type: 'edge_ngram',
//                         min_gram: 2,
//                         max_gram: 5,
//                         token_chars: ['letter'],
//                     },
//                 },
//             },
//         },
//     },
//     mappings: {
//         properties: {
//             fullName: {
//                 type: 'text',
//                 fields: {
//                     keywordstring: {
//                         type: 'text',
//                         analyzer: 'keyword_analyzer',
//                     },
//                     edgengram: {
//                         type: 'text',
//                         analyzer: 'edge_ngram_analyzer',
//                         search_analyzer: 'edge_ngram_search_analyzer',
//                     },
//                     completion: {
//                         type: 'completion',
//                     },
//                 },
//                 analyzer: 'standard',
//             },
//         },
//     },
// };
// export const settings = {
//     index: {
//         analysis: {
//             filter: {},
//             analyzer: {
//                 keyword_analyzer: {
//                     filter: ['lowercase', 'asciifolding', 'trim'],
//                     char_filter: [],
//                     type: 'custom',
//                     tokenizer: 'keyword',
//                 },
//                 edge_ngram_analyzer: {
//                     filter: ['lowercase'],
//                     tokenizer: 'edge_ngram_tokenizer',
//                 },
//                 edge_ngram_search_analyzer: {
//                     tokenizer: 'lowercase',
//                 },
//             },
//             tokenizer: {
//                 edge_ngram_tokenizer: {
//                     type: 'edge_ngram',
//                     min_gram: 2,
//                     max_gram: 5,
//                     token_chars: ['letter'],
//                 },
//             },
//         },
//     },
// };
// export const mappings = {
//     properties: {
//         fullName: {
//             type: 'text',
//             fields: {
//                 keywordstring: {
//                     type: 'text',
//                     analyzer: 'keyword_analyzer',
//                 },
//                 edgengram: {
//                     type: 'text',
//                     analyzer: 'edge_ngram_analyzer',
//                     search_analyzer: 'edge_ngram_search_analyzer',
//                 },
//                 completion: {
//                     type: 'completion',
//                 },
//             },
//             analyzer: 'standard',
//         },
//     },
// };

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
        tokenizer: 'lowercase',
    },
    path_hierarchy: {
        tokenizer: 'custom_path_hierarchy',
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
