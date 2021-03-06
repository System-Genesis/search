/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import * as request from 'supertest';
import * as qs from 'qs';
import Server from '../src/express/server';


export let server: Server;

beforeAll(async () => {
    server = new Server(3005);
    console.log('Starting server...');
    try {
        await server.start();
    } catch (err) { console.log(err.message) }

    console.log(`Server started on port: 3005`);
});
afterAll(async () => {
    await server.close();
});
describe('GET /search with ', () => {
    it('source on rule filters: mir_name, es_name ,should return 200  & valid response and 4 entity ', async (done) => {
        request(server.app)
            .get(`/api/digitalIdentities/search`)
            .query(
                qs.stringify({
                    ruleFilters: [{ field: 'source', entityType: 'digitalIdentity', values: ['mir_name', 'es_name'] }],
                    uniqueId: 'e208',
                }),
            )
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            type: 'domUser',
                            source: 'city_name',
                            uniqueId: 'e208059699@city.com',
                            isRoleAttachable: true,
                            entityId: 0,
                            role: [
                                {
                                    hierarchyIds: [1, 6],
                                    roleId: 'e208059699@city',
                                    jobTitle: 'International Identity Technician',
                                    hierarchy: 'wallmart/temporibus/quisquam',
                                    source: 'city_name',
                                },
                            ],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('source on rule filters: mir_name, es_name ,should and user filters: mir_name return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/digitalIdentities/search`)
            .query(
                qs.stringify({
                    ruleFilters: [{ field: 'source', entityType: 'digitalIdentity', values: ['es_name', 'city_name'] }],
                    uniqueId: 'e286',
                    source: 'mir_name',
                }),
            )
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            type: 'digUser',
                            source: 'mir_name',
                            uniqueId: 'e286444822@city.com',
                            isRoleAttachable: false,
                            entityId: 34,
                            role: [],
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('source on rule filters: !mir_name, es_name ,should return 200  & valid response and empty array ', async (done) => {
        request(server.app)
            .get(`/api/digitalIdentities/search`)
            .query(
                qs.stringify({
                    ruleFilters: [{ field: 'source', entityType: 'digitalIdentity', values: ['mir_name'] }],
                    uniqueId: 'e208',
                    source: ['es_name', 'city_name'],
                }),
            )
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            type: 'domUser',
                            source: 'city_name',
                            uniqueId: 'e208059699@city.com',
                            isRoleAttachable: true,
                            entityId: 0,
                            role: [
                                {
                                    hierarchyIds: [1, 6],
                                    roleId: 'e208059699@city',
                                    jobTitle: 'International Identity Technician',
                                    hierarchy: 'wallmart/temporibus/quisquam',
                                    source: 'city_name',
                                },
                            ],
                        },


                    ].toString(),
                );
                return done();
            });
    });
});
