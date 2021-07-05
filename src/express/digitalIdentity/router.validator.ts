import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        uniqueId: Joi.string().required().min(2).max(20),
        type: Joi.string(),
        source: Joi.string(),
        isRoleAttachable: Joi.string(),
        mail: Joi.string(),
        jobTtile: Joi.string(),
        entityId: Joi.string(),
    },
});

export default { getSearchRequestSchema };
