/* eslint-disable prettier/prettier */
import * as request from 'supertest';
import * as qs from 'qs';

import { server } from './digitalIdentity.spec';

describe('GET /search with ', () => {
    it('!es_name ,should return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(qs.stringify({ ruleFilters: [{ field: 'source', values: ['es_name'], entityType: 'digitalIdentity' }], fullName: 'ma' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 157861771,
                            entityType: 'agumon',
                            personalNumber: '9181557',
                            firstName: 'Macy',
                            lastName: 'Ryan',
                            akaUnit: 'gondor',
                            mail: 'Macy_Ryan@jello.com',
                            job: 'Coordinator - Principal Tactics Architect',
                            sex: 'ז',
                            phone: '6115',
                            mobilePhone: '59-7650102',
                            digitalIdentities: [
                                {
                                    type: 'domUser',
                                    source: 'city_name',
                                    mail: 'Macy_Ryan@jello.com',
                                    uniqueId: 'Macy_Ryan@jello.com',
                                    isRoleAttachable: true,
                                    role: [],
                                },
                            ],
                            displayName: 'Macy Ryan',
                            fullName: 'Macy Ryan',
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('should return 200 & valid response ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(qs.stringify({ fullName: 'ma' }))
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw done(err);
                }
                expect(res.body.toString()).toBe(
                    [
                        {
                            id: 157861771,
                            entityType: 'agumon',
                            personalNumber: '9181557',
                            firstName: 'Macy',
                            lastName: 'Ryan',
                            akaUnit: 'gondor',
                            mail: 'Macy_Ryan@jello.com',
                            job: 'Coordinator - Principal Tactics Architect',
                            sex: 'ז',
                            phone: '6115',
                            mobilePhone: '59-7650102',
                            digitalIdentities: [
                                {
                                    type: 'domUser',
                                    source: 'city_name',
                                    mail: 'Macy_Ryan@jello.com',
                                    uniqueId: 'Macy_Ryan@jello.com',
                                    isRoleAttachable: true,
                                    role: [],
                                },
                            ],
                            displayName: 'Macy Ryan',
                            fullName: 'Macy Ryan',
                        },
                        {
                            id: 157861738,
                            entityType: 'agumon',
                            personalNumber: '1299157',
                            firstName: 'Jermain',
                            lastName: 'MacGyver',
                            akaUnit: 'gondor',
                            rank: 'ultimate',
                            mail: 'Jermain.MacGyver88@jello.com',
                            job: 'Technician - National Research Facilitator',
                            sex: 'ז',
                            phone: '2882',
                            mobilePhone: '57-5367865',
                            digitalIdentities: [
                                {
                                    type: 'domUser',
                                    source: 'es_name',
                                    mail: 'Jermain.MacGyver88@jello.com',
                                    uniqueId: 'Jermain.MacGyver88@jello.com',
                                    isRoleAttachable: true,
                                    role: [],
                                },
                            ],
                            displayName: 'Jermain MacGyver',
                            fullName: 'Jermain MacGyver',
                        },
                    ].toString(),
                );
                return done();
            });
    });

    it('should return 400 & err response ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(qs.stringify({ fullName: 'm' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });

    it('should return 200 & err response ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(qs.stringify({ fullName: 'm' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });

    it('filter rank "ultimate" and userfilter es,city and rulefilter !city ,should return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(
                qs.stringify({
                    'digitalIdentities.source': ['city_name', 'es_name'],
                    rank: 'ultimate',
                    ruleFilters: [{ field: 'source', values: ['city_name'], entityType: 'digitalIdentity' }],
                    fullName: 'ma',
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
                            id: 157861728,
                            entityType: 'agumon',
                            personalNumber: '9992756',
                            firstName: 'Wallace',
                            lastName: 'Kutch',
                            akaUnit: 'gondor',
                            mail: 'Wallace52@jello.com',
                            job: 'Producer - Principal Solutions Consultant',
                            sex: 'ז',
                            phone: '4805',
                            mobilePhone: '52-1084219',
                            digitalIdentities: [
                                {
                                    type: 'domUser',
                                    source: 'es_name',
                                    mail: 'Wallace52@jello.com',
                                    uniqueId: 'Wallace52@jello.com',
                                    isRoleAttachable: true,
                                    role: [
                                        {
                                            hierarchyIds: [152],
                                            roleId: 'Wallace52@jello',
                                            jobTitle: 'Producer - Principal Solutions Consultant',
                                            hierarchy: 'wallmart/tempore/dolore/doloribus',
                                            source: 'es_name',
                                        },
                                    ],
                                },
                            ],
                            displayName: 'Wallace Kutch',
                            fullName: 'Wallace Kutch',
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('filter rank "ultimated" and userfilter es,city and rulefilter !city ,should return 200  & empty array ', async (done) => {
        request(server.app)
            .get(`/api/entities/search`)
            .query(
                qs.stringify({
                    'digitalIdentities.source': ['city_name', 'es_name'],
                    rank: 'ultimated',
                    ruleFilters: [{ field: 'source', values: ['city_name'], entityType: 'digitalIdentity' }],
                    fullName: 'ma',
                }),
            )
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
