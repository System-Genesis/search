import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: {
        uniqueId: Joi.string().required().min(2).max(20),
        ruleFilters: Joi.array(),
        userFilters: Joi.array(),
    },
});

export default { getSearchRequestSchema };
