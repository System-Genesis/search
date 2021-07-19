import * as qs from 'qs';
import * as request from 'supertest';
import { server } from './digitalIdentity.spec';

describe('GET /search with ', () => {
    it('roleId only ', async (done) => {
        request(server.app)
            .get(`/api/role/search`)
            .query(qs.stringify({ roleId: 'es2' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            hierarchyIds: [1, 30],
                            roleId: 'e226410902@city',
                            jobTitle: 'International Configuration Specialist',
                            hierarchy: 'wallmart/quidem/itaque',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [173],
                            roleId: 'Esperanza77@leonardo',
                            hierarchy: 'sint/sapiente/omnis/quidem/praesentium',
                            source: 'sf_name',
                        },
                        {
                            hierarchyIds: [1, 12],
                            roleId: 'e820566319@city',
                            jobTitle: 'Lead Communications Supervisor',
                            hierarchy: 'wallmart/beatae/ut',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [1, 9],
                            roleId: 'e521925943@city',
                            jobTitle: 'Corporate Data Designer',
                            hierarchy: 'wallmart/et/eos',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [0],
                            roleId: 'e261976729@city',
                            jobTitle: 'Lead Brand Agent',
                            hierarchy: 'city_name/odyssey',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [1, 6],
                            roleId: 'e208059699@city',
                            jobTitle: 'International Identity Technician',
                            hierarchy: 'wallmart/temporibus/quisquam',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [1, 40],
                            roleId: 'e233942883@city',
                            jobTitle: 'Customer Accounts Director',
                            hierarchy: 'wallmart/beatae/qui',
                            source: 'city_name',
                        },
                        {
                            hierarchyIds: [],
                            roleId: 'e205715386@city',
                            jobTitle: 'Customer Applications Planner',
                            hierarchy: 'city_name/interstellar/vero/ea/consequuntur/accusamus',
                            source: 'city_name',
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('!city_name ,should return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/role/search`)
            .query(qs.stringify({ roleId: 'es2', ruleFilters: [{ field: 'source', entityType: 'Role', values: ['!city_name'] }] }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            hierarchyIds: [173],
                            roleId: 'Esperanza77@leonardo',
                            hierarchy: 'sint/sapiente/omnis/quidem/praesentium',
                            source: 'sf_name',
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('roleId bad request less than 2 letters, should return 400', async (done) => {
        request(server.app)
            .get(`/api/role/search`)
            .query(qs.stringify({ roleId: 'e' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });
});
