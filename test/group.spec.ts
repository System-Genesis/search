/* eslint-disable prettier/prettier */
import * as qs from 'qs';
import * as request from 'supertest';
import { server } from './digitalIdentity.spec';

describe('GET /search with ', () => {
    it('name only ', async (done) => {
        request(server.app)
            .get(`/api/groups/search`)
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
            .get(`/api/groups/search`)
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
                    ].toString(),
                );
                return done();
            });
    });
    it('name bad request less than 2 letters, should return 400', async (done) => {
        request(server.app)
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'e' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });
    it('name and hierarchy and is active, should return 200 and objects', async (done) => {
        request(server.app)
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', isAlive: true }))
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
                    ].toString(),
                );
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is valid, should return groups and 200', async (done) => {
        request(server.app)
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ['1'] }))
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
                    ].toString(),
                );
                return done();
            });
    });
    it('name and hierarchy and is underGroupId is not existing in any of the objects, should return [] and 200', async (done) => {
        request(server.app)
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ['2'] }))
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
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ['2', '!1'] }))
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
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ['2', '!1'] }))
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
            .get(`/api/groups/search`)
            .query(qs.stringify({ name: 'ha', hierarchy: 'wall', underGroupId: ['!36', '1'] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe([].toString());
                return done();
            });
    });
});
