import * as Joi from 'joi';

export const EntitySchema = Joi.object({
    id: Joi.string(),
    displayName: Joi.string(),
    entityType: Joi.string(),
    identityCard: Joi.string(),
    personalNumber: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    akaUnit: Joi.string(),
    status: Joi.string(),
    dischargeDay: Joi.date(),
    rank: Joi.string(),
    mail: Joi.string(),
    job: Joi.string(),
    phone: Joi.array().items(Joi.string()),
    mobilePhone: Joi.array().items(Joi.string()),
    address: Joi.string(),
    clearance: Joi.string(),
    pictures: Joi.object({
        profile: Joi.object(),
    }),
    sex: Joi.string(),
    birthDate: Joi.date(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    digitalIdentities: Joi.array(),
    directGroup: Joi.object(),
    managedGroup: Joi.object(),
});
export const EntityFilters = Joi.object({
    status: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    entityType: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    'digitalIdentities.source': Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    'digitalIdentities.mail': Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    mail: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    rank: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    responsibility: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
    hierarchyPath: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
});

export const getSearchRequestSchema = Joi.object({
    query: {
        fullName: Joi.string().required().min(2),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        status: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        entityType: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        'digitalIdentity.source': Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        'digitalIdentities.mail': Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        mail: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        rank: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        responsibility: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        hierarchyPath: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        expanded: Joi.alternatives().try(Joi.array(), Joi.string(), Joi.boolean()).allow(Joi.array().length(0)),
        underGroupId: Joi.alternatives().try(Joi.array(), Joi.bool()).allow(Joi.array().length(0)),
    },
});

export const getPostRequestSchema = Joi.object({
    body: Joi.alternatives().try(Joi.array().items(EntitySchema), EntitySchema),
});

export default { getSearchRequestSchema, getPostRequestSchema };
