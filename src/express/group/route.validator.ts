import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        name: Joi.string().required().min(2).max(20),
        hierarchy: Joi.string().min(2).max(20),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        userFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    },
});

export default { getSearchRequestSchema };
