import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        name: Joi.string().min(2),
        nameAndHierarchy: Joi.string().min(2),
        hierarchy: Joi.string().min(2),
        source: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        underGroupId: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        isAlive: Joi.alternatives().try(Joi.array(), Joi.bool()).allow(Joi.array().length(0)),
        status: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        expanded: Joi.alternatives().try(Joi.array(), Joi.string(), Joi.boolean()).allow(Joi.array().length(0)),
    },
});

export default { getSearchRequestSchema };
