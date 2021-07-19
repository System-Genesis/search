module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
    timers: 'fake',
    runFirstly: ['digitalIdentity.spec.ts', 'entity.spec.ts'],
};
