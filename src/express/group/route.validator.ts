import * as Joi from 'joi';

export const getSearchRequestSchema = Joi.object({
    query: { fullName: Joi.string().required().min(2).max(20) },
});

export default { getSearchRequestSchema };
