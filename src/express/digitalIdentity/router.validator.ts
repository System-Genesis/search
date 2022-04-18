import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        uniqueId: Joi.string().required().min(2),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        type: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        source: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        isRoleAttachable: Joi.alternatives().try(Joi.array(), Joi.bool()).allow(Joi.array().length(0)),
        mail: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        jobTitle: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        entityId: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        expanded: Joi.alternatives().try(Joi.array(), Joi.string(), Joi.boolean()).allow(Joi.array().length(0)),
    },
});

export default { getSearchRequestSchema };
