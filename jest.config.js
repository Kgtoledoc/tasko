module.exports = {
  // Configuración para testing del proyecto completo
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/backend/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      collectCoverageFrom: [
        'backend/src/**/*.ts',
        '!backend/src/**/*.d.ts',
        '!backend/src/index.ts',
      ],
      coverageDirectory: 'coverage/backend',
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/frontend/src/**/*.test.{ts,tsx}'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/frontend/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/frontend/src/setupTests.ts'],
      collectCoverageFrom: [
        'frontend/src/**/*.{ts,tsx}',
        '!frontend/src/**/*.d.ts',
        '!frontend/src/index.tsx',
        '!frontend/src/reportWebVitals.ts',
      ],
      coverageDirectory: 'coverage/frontend',
    },
  ],
  
  // Configuración global
  verbose: true,
  testTimeout: 10000,
  
  // Reportes
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
  
  // Configuración de coverage
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}; 