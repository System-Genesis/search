import * as Joi from 'joi';

// const JoiBooleanConvertible: joi.Extension = {
//     type: 'stringbool',
//     base: joi.string(),

//     coerce: {
//         from: 'string',
//         method(value, _helpers) {
//             return { value: value.toString() === 'true' };
//         },
//     },
// };
// joi.extend((joi) : joi.Extension => {
//     return {
//       type: 'string',
//       base: joi.string(),
//       name: 'booleanConvertible',
//       coerce:{ from:'string',method(value, helpers) {
//         function returnBool (n):any {
//           return n === 'true'
//         }
//         return returnBool(value)
//       }
//     }
//     }
//   })

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
const customJoi = Joi.defaults((schema) =>
    schema.options({
        stripUnknown: true,
    }),
);
export const getSearchRequestSchema = customJoi.object({
    query: {
        fullName: Joi.string().required().min(2).max(20),
        ruleFilters: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        status: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        entityType: Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
        'digitalIdentities.source': Joi.alternatives().try(Joi.array(), Joi.string()).allow(Joi.array().length(0)),
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
