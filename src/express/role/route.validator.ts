import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        roleId: Joi.string().required().min(2).max(20),
        jobTitle: Joi.string(),
        hierarchy: Joi.string(),
        source: Joi.string(),
    },
});

export default { getSearchRequestSchema };
