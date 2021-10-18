/* eslint-disable prettier/prettier */
import * as qs from 'qs';
import * as request from 'supertest';
import { server } from './digitalIdentity.spec';

describe('GET /search with ', () => {
    it('name only ', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'wall' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 1,
                            ancestors: [],
                            name: 'wallmart',
                            source: 'city_name',
                            hierarchy: '',
                            status: 'active',
                            directRole: [
                                {
                                    hierarchyIds: [],
                                    roleId: 'j126908124@city',
                                    jobTitle: 'Chief Data Supervisor',
                                    digitalIdentityUniqueId: 'j126908124@city.com',
                                    hierarchy: 'city_name',
                                    source: 'city_name',
                                },
                                {
                                    hierarchyIds: [],
                                    roleId: 'mads710057137@city',
                                    jobTitle: 'Regional Program Planner',
                                    digitalIdentityUniqueId: 'mads710057137@city.com',
                                    hierarchy: 'city_name',
                                    source: 'city_name',
                                },
                                {
                                    hierarchyIds: [],
                                    roleId: 'madNN723718549@city',
                                    jobTitle: 'Lead Division Assistant',
                                    digitalIdentityUniqueId: 'madNN723718549@city.com',
                                    hierarchy: 'city_name',
                                    source: 'city_name',
                                },
                            ],
                            directEntities: [
                                {
                                    id: 151,
                                    entityType: 'digimon',
                                    personalNumber: '9026378',
                                    firstName: 'Brett',
                                    lastName: 'Champlin',
                                    akaUnit: 'gondor',
                                    rank: 'rookie',
                                    job: 'Chief Data Supervisor',
                                    clearance: 3,
                                    dischargeDay: '2028-10-28T01:05:18.240Z',
                                    mobilePhone: '0528791171',
                                },
                                {
                                    id: 97,
                                    entityType: 'tamar',
                                    firstName: 'Nico',
                                    lastName: 'Labadie',
                                    akaUnit: 'gondor',
                                    job: 'Lead Division Assistant',
                                    goalUserId: 'madNN723718549',
                                    mobilePhone: '0519890549',
                                },
                                {
                                    id: 96,
                                    entityType: 'tamar',
                                    firstName: 'Keira',
                                    lastName: 'Kunde',
                                    akaUnit: 'gondor',
                                    job: 'Regional Program Planner',
                                    goalUserId: '710057137',
                                    mobilePhone: '0592240044',
                                },
                            ],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('nane and hierarchy ,should return 200  & valid response ', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'amet' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 164,
                            ancestors: [1, 36],
                            name: 'harum',
                            source: 'es_name',
                            hierarchy: 'wallmart/amet',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 84,
                            ancestors: [1, 36],
                            name: 'assumenda',
                            source: 'city_name',
                            hierarchy: 'wallmart/amet',
                            status: 'active',
                            directRole: [
                                {
                                    hierarchyIds: [1, 36],
                                    roleId: 'e778538841@city',
                                    jobTitle: 'Legacy Infrastructure Developer',
                                    digitalIdentityUniqueId: 'e778538841@city.com',
                                    hierarchy: 'wallmart/amet/assumenda',
                                    source: 'city_name',
                                },
                                {
                                    hierarchyIds: [1, 36],
                                    roleId: 'g565815369@city',
                                    jobTitle: 'Dynamic Mobility Orchestrator',
                                    digitalIdentityUniqueId: 'g565815369@city.com',
                                    hierarchy: 'wallmart/nihil/dolorem',
                                    source: 'city_name',
                                },
                                {
                                    hierarchyIds: [1, 36],
                                    roleId: 'l926539884@city',
                                    jobTitle: 'Customer Communications Developer',
                                    digitalIdentityUniqueId: 'l926539884@city.com',
                                    hierarchy: 'wallmart/ipsam/nihil',
                                    source: 'city_name',
                                },
                                {
                                    hierarchyIds: [1, 36],
                                    roleId: 'ii207797727@city',
                                    jobTitle: 'Regional Group Assistant',
                                    digitalIdentityUniqueId: 'ii207797727@city.com',
                                    hierarchy: 'wallmart/similique/voluptas',
                                    source: 'city_name',
                                },
                            ],
                            directEntities: [
                                {
                                    id: 183,
                                    entityType: 'digimon',
                                    personalNumber: '1370059',
                                    firstName: 'Abigail',
                                    lastName: 'Kozey',
                                    akaUnit: 'gondor',
                                    job: 'Dynamic Mobility Orchestrator',
                                    clearance: 4,
                                    identityCard: '35869122',
                                    mobilePhone: '0588305044',
                                },
                                {
                                    id: 186,
                                    entityType: 'agumon',
                                    personalNumber: '7202775',
                                    firstName: 'Frederique',
                                    lastName: 'Yost',
                                    akaUnit: 'gondor',
                                    rank: 'ultimate',
                                    job: 'Legacy Infrastructure Developer',
                                    clearance: 2,
                                    mobilePhone: '0543029990',
                                },
                                {
                                    id: 193,
                                    entityType: 'agumon',
                                    personalNumber: '5260524',
                                    firstName: 'Bradly',
                                    lastName: "O'Reilly",
                                    akaUnit: 'gondor',
                                    rank: 'rookie',
                                    job: 'Regional Group Assistant',
                                    clearance: 3,
                                    dischargeDay: '2021-02-04T18:32:19.275Z',
                                    mobilePhone: '0532142522',
                                },
                                {
                                    id: 194,
                                    entityType: 'agumon',
                                    personalNumber: '7266397',
                                    firstName: 'Laura',
                                    lastName: 'Halvorson',
                                    akaUnit: 'gondor',
                                    job: 'Customer Communications Developer',
                                    clearance: 4,
                                    dischargeDay: '2027-05-21T11:49:07.170Z',
                                    mobilePhone: '0591773124',
                                },
                            ],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('name bad request less than 2 letters, should return 400', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: "e" }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });
    it('name and hierarchy and is active, should return 200 and objects', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: "ha", hierarchy: "wall", isAlive: true }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 164,
                            ancestors: [1, 36],
                            name: 'harum',
                            source: 'es_name',
                            hierarchy: 'wallmart/amet',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 4,
                            ancestors: [1],
                            name: 'possimus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 5,
                            ancestors: [1],
                            name: 'id',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 6,
                            ancestors: [1],
                            name: 'temporibus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 7,
                            ancestors: [1],
                            name: 'ipsa',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 8,
                            ancestors: [1],
                            name: 'molestiae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 9,
                            ancestors: [1],
                            name: 'et',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [
                                {
                                    hierarchyIds: [1],
                                    roleId: 'e553414694@city',
                                    jobTitle: 'Direct Communications Agent',
                                    digitalIdentityUniqueId: 'e553414694@city.com',
                                    hierarchy: 'city_name/bladerunners',
                                    source: 'city_name',
                                },
                            ],
                            directEntities: [
                                {
                                    id: 221,
                                    entityType: 'agumon',
                                    personalNumber: '94373869',
                                    firstName: 'Deja',
                                    lastName: 'Strosin',
                                    akaUnit: 'gondor',
                                    job: 'Direct Communications Agent',
                                    clearance: 4,
                                    mobilePhone: '0562926721',
                                },
                            ],
                        },
                        {
                            id: 12,
                            ancestors: [1],
                            name: 'inventore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 13,
                            ancestors: [1],
                            name: 'beatae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 14,
                            ancestors: [1],
                            name: 'ut',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 15,
                            ancestors: [1],
                            name: 'nobis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 16,
                            ancestors: [1],
                            name: 'magnam',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 17,
                            ancestors: [1],
                            name: 'doloremque',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 18,
                            ancestors: [1],
                            name: 'molestias',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 25,
                            ancestors: [1],
                            name: 'a',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 26,
                            ancestors: [1],
                            name: 'qui',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 27,
                            ancestors: [1],
                            name: 'nostrum',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 28,
                            ancestors: [1],
                            name: 'tempore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 29,
                            ancestors: [1],
                            name: 'voluptatem',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 30,
                            ancestors: [1],
                            name: 'blanditiis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is valid, should return groups and 200', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ["1"], heyyy: 'haha' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 164,
                            ancestors: [1, 36],
                            name: 'harum',
                            source: 'es_name',
                            hierarchy: 'wallmart/amet',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 4,
                            ancestors: [1],
                            name: 'possimus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 5,
                            ancestors: [1],
                            name: 'id',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 6,
                            ancestors: [1],
                            name: 'temporibus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 7,
                            ancestors: [1],
                            name: 'ipsa',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 8,
                            ancestors: [1],
                            name: 'molestiae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 9,
                            ancestors: [1],
                            name: 'et',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [
                                {
                                    hierarchyIds: [1],
                                    roleId: 'e553414694@city',
                                    jobTitle: 'Direct Communications Agent',
                                    digitalIdentityUniqueId: 'e553414694@city.com',
                                    hierarchy: 'city_name/bladerunners',
                                    source: 'city_name',
                                },
                            ],
                            directEntities: [
                                {
                                    id: 221,
                                    entityType: 'agumon',
                                    personalNumber: '94373869',
                                    firstName: 'Deja',
                                    lastName: 'Strosin',
                                    akaUnit: 'gondor',
                                    job: 'Direct Communications Agent',
                                    clearance: 4,
                                    mobilePhone: '0562926721',
                                },
                            ],
                        },
                        {
                            id: 12,
                            ancestors: [1],
                            name: 'inventore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 13,
                            ancestors: [1],
                            name: 'beatae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 14,
                            ancestors: [1],
                            name: 'ut',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 15,
                            ancestors: [1],
                            name: 'nobis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 16,
                            ancestors: [1],
                            name: 'magnam',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 17,
                            ancestors: [1],
                            name: 'doloremque',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 18,
                            ancestors: [1],
                            name: 'molestias',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 25,
                            ancestors: [1],
                            name: 'a',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 26,
                            ancestors: [1],
                            name: 'qui',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 27,
                            ancestors: [1],
                            name: 'nostrum',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 28,
                            ancestors: [1],
                            name: 'tempore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 29,
                            ancestors: [1],
                            name: 'voluptatem',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 30,
                            ancestors: [1],
                            name: 'blanditiis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is not existing in any of the objects, should return [] and 200', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ["2"] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe([].toString());
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is NOT(!) in rules is not existing in any of the objects, should return [] and 200', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ["2", "!1"] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe([].toString());
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is NOT(!) in user rules is not existing in any of the objects, should return [] and 200', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ["2", "!1"] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe([].toString());
                return done();
            });
    });
    it('name and hierarchy and check undergroupId with 2 values: ancestors (!36,1) and in in user rules is not existing in any of the objects, should return [] and 200', async (done) => {
        request(server.app)
            .get(`/api/organizationGroups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ["!36", "1"] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 4,
                            ancestors: [1],
                            name: 'possimus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 5,
                            ancestors: [1],
                            name: 'id',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 6,
                            ancestors: [1],
                            name: 'temporibus',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 7,
                            ancestors: [1],
                            name: 'ipsa',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 8,
                            ancestors: [1],
                            name: 'molestiae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 9,
                            ancestors: [1],
                            name: 'et',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [
                                {
                                    hierarchyIds: [1],
                                    roleId: 'e553414694@city',
                                    jobTitle: 'Direct Communications Agent',
                                    digitalIdentityUniqueId: 'e553414694@city.com',
                                    hierarchy: 'city_name/bladerunners',
                                    source: 'city_name',
                                },
                            ],
                            directEntities: [
                                {
                                    id: 221,
                                    entityType: 'agumon',
                                    personalNumber: '94373869',
                                    firstName: 'Deja',
                                    lastName: 'Strosin',
                                    akaUnit: 'gondor',
                                    job: 'Direct Communications Agent',
                                    clearance: 4,
                                    mobilePhone: '0562926721',
                                },
                            ],
                        },
                        {
                            id: 12,
                            ancestors: [1],
                            name: 'inventore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 13,
                            ancestors: [1],
                            name: 'beatae',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 14,
                            ancestors: [1],
                            name: 'ut',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 15,
                            ancestors: [1],
                            name: 'nobis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 16,
                            ancestors: [1],
                            name: 'magnam',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 17,
                            ancestors: [1],
                            name: 'doloremque',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 18,
                            ancestors: [1],
                            name: 'molestias',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 25,
                            ancestors: [1],
                            name: 'a',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 26,
                            ancestors: [1],
                            name: 'qui',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 27,
                            ancestors: [1],
                            name: 'nostrum',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 28,
                            ancestors: [1],
                            name: 'tempore',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 29,
                            ancestors: [1],
                            name: 'voluptatem',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 30,
                            ancestors: [1],
                            name: 'blanditiis',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                        {
                            id: 31,
                            ancestors: [1],
                            name: 'sapiente',
                            source: 'city_name',
                            hierarchy: 'wallmart',
                            status: 'active',
                            directRole: [],
                            directEntities: [],
                        },
                    ].toString(),
                );
                return done();
            });
    });
});
