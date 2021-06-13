const settingsGeneral = {
    settings: {
        index: {
            analysis: {
                filter: {},
                analyzer: {
                    keyword_analyzer: {
                        filter: ['lowercase', 'asciifolding', 'trim'],
                        char_filter: [],
                        type: 'custom',
                        tokenizer: 'keyword',
                    },
                    edge_ngram_analyzer: {
                        filter: ['lowercase'],
                        tokenizer: 'edge_ngram_tokenizer',
                    },
                    edge_ngram_search_analyzer: {
                        tokenizer: 'lowercase',
                    },
                },
                tokenizer: {
                    edge_ngram_tokenizer: {
                        type: 'edge_ngram',
                        min_gram: 2,
                        max_gram: 5,
                        token_chars: ['letter'],
                    },
                },
            },
        },
    },
    mappings: {
        properties: {
            fullName: {
                type: 'text',
                fields: {
                    keywordstring: {
                        type: 'text',
                        analyzer: 'keyword_analyzer',
                    },
                    edgengram: {
                        type: 'text',
                        analyzer: 'edge_ngram_analyzer',
                        search_analyzer: 'edge_ngram_search_analyzer',
                    },
                    completion: {
                        type: 'completion',
                    },
                },
                analyzer: 'standard',
            },
        },
    },
};
const settings = {
    index: {
        analysis: {
            filter: {},
            analyzer: {
                keyword_analyzer: {
                    filter: ['lowercase', 'asciifolding', 'trim'],
                    char_filter: [],
                    type: 'custom',
                    tokenizer: 'keyword',
                },
                edge_ngram_analyzer: {
                    filter: ['lowercase'],
                    tokenizer: 'edge_ngram_tokenizer',
                },
                edge_ngram_search_analyzer: {
                    tokenizer: 'lowercase',
                },
            },
            tokenizer: {
                edge_ngram_tokenizer: {
                    type: 'edge_ngram',
                    min_gram: 2,
                    max_gram: 5,
                    token_chars: ['letter'],
                },
            },
        },
    },
};
const mappings = {
    properties: {
        fullName: {
            type: 'text',
            fields: {
                keywordstring: {
                    type: 'text',
                    analyzer: 'keyword_analyzer',
                },
                edgengram: {
                    type: 'text',
                    analyzer: 'edge_ngram_analyzer',
                    search_analyzer: 'edge_ngram_search_analyzer',
                },
                completion: {
                    type: 'completion',
                },
            },
            analyzer: 'standard',
        },
    },
};

const queryBuilder = (searchArg: string) => {
    return {
        query: {
            prefix: {
                'fullName.edgengram': searchArg,
            },
        },
    };
};
