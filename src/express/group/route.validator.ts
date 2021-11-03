import * as Joi from 'joi';

const customJoi = Joi.defaults((schema) =>
    schema.options({
        stripUnknown: true,
    }),
);

export const getSearchRequestSchema = customJoi.object({
    query: {
        name: Joi.string().required().min(2).max(20),
        hierarchy: Joi.string().min(2).max(20),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        underGroupId: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        isAlive: Joi.alternatives().try(Joi.array(), Joi.bool()).allow(Joi.array().length(0)),
        status: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        expanded: Joi.alternatives().try(Joi.array(), Joi.string(), Joi.boolean()).allow(Joi.array().length(0)),
    },
});

export default { getSearchRequestSchema };
