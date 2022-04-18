/* eslint-disable prettier/prettier */
import * as qs from 'qs';
import * as request from 'supertest';
import { server } from './digitalIdentity.spec';

describe('GET /search with ', () => {
    it('roleId only ', async (done) => {
        request(server.app)
            .get(`/api/roles/search`)
            .query(qs.stringify({ roleId: 'e226410' }))
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
                    ].toString(),
                );
                return done();
            });
    });
    it('!city_name ,should return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/roles/search`)
            .query(qs.stringify({ roleId: 'esp', ruleFilters: [{ field: 'source', entityType: 'role', values: ['city_name'] }] }))
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
            .get(`/api/roles/search`)
            .query(qs.stringify({ roleId: 'e' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });
});
