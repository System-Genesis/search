import * as Joi from 'joi';

const customJoi = Joi.defaults((schema) =>
    schema.options({
        stripUnknown: true,
    }),
);

export const getSearchRequestSchema = customJoi.object({
    query: {
        roleId: Joi.string().required().min(2).max(20),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        jobTitle: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        hierarchy: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        source: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        directGroup: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    },
});

export default { getSearchRequestSchema };
