import * as request from 'supertest';
import * as qs from 'qs';
import Server from '../src/express/server';
import config from '../src/config/index';
// import promiseAllWithFails from '../src/utils/promiseAllWithFails'
const { service } = config;

let server: Server;

beforeAll(async () => {
    jest.useFakeTimers();
    server = new Server(service.port);
    console.log('Starting server...');

    await server.start();

    console.log(`Server started on port: ${service.port}`);
});
afterAll((done) => {
    server.http.close(done);
});
describe('GET /search with ', () => {
    it('!es_name ,should return 200  & valid response and 1 entity ', async (done) => {
        request(server.app)
            .get(`/api/entity/search`)
            .query(qs.stringify({ ruleFilters: [{ field: 'source', values: ['!es_name'], entityType: 'Digital Identity' }], fullName: 'ma' }))
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
                        },
                    ].toString(),
                );
                return done();
            });
    });
    it('should return 200 & valid response ', async (done) => {
        request(server.app)
            .get(`/api/entity/search`)
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
                        },
                    ].toString(),
                );
                return done();
            });
    });

    it('should return 400 & err response ', async (done) => {
        request(server.app)
            .get(`/api/entity/search`)
            .query(qs.stringify({ fullName: 'm' }))
            .expect(400)
            .end((err, _) => {
                return done(err);
            });
    });
});
