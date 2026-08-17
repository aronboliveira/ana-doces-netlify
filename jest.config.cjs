/** Standalone Jest config — this project runs on Vite (dev/build), not CRA, so Jest
 * no longer inherits react-scripts' bundled preset and needs its own transform + env setup. */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  // tsconfig baseUrl is the project root ("."), so imports like "src/foo/Bar" (seen
  // throughout the test suite) resolve relative to <rootDir>, not <rootDir>/src.
  modulePaths: ["<rootDir>"],
  setupFiles: ["<rootDir>/src/tests/jestSetup.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.spec.{ts,tsx}",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.module\\.scss$": "<rootDir>/src/tests/cssModuleMock.cjs",
    "\\.scss$": "<rootDir>/src/tests/styleMock.cjs",
    "\\.css$": "<rootDir>/src/tests/styleMock.cjs",
    "^\\.\\./declarations/(types|interfaces)$": "<rootDir>/src/declarations/$1.d.ts",
    "^\\.\\./\\.\\./declarations/(types|interfaces)$": "<rootDir>/src/declarations/$1.d.ts",
    "^src/declarations/(types|interfaces)$": "<rootDir>/src/declarations/$1.d.ts",
    "^\\./declarations/(types|interfaces)$": "<rootDir>/src/declarations/$1.d.ts",
    "^\\./(types|interfaces)$": "<rootDir>/src/declarations/$1.d.ts",
  },
  moduleFileExtensions: ["tsx", "ts", "jsx", "js", "json"],
};
