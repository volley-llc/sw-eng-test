/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
    roots: ["<rootDir>/src"],
    clearMocks: true,
    preset: "ts-jest",
    globals: {
        "ts-jest": {
            isolatedModules: true
        },
    },
    testEnvironment: "node",
};
