/**
 * Manual Jest mock for src/handlersErrors.tsx, auto-applied by every
 * bare `jest.mock(".../handlersErrors")` call across the suite.
 *
 * The plain automock (jest.fn() with no implementation) makes every
 * error constructor return `undefined`. Application code overwhelmingly
 * calls these as `throw htmlElementNotFound(...)`, and plenty of that is
 * reached in perfectly normal, unrelated code paths during a render
 * (not just the specific branch a given test is trying to exercise) --
 * `throw undefined` followed by `(e as Error).message` in the catching
 * try/catch then crashes the test outright instead of the intended
 * graceful console.error. Returning real Error instances by default
 * keeps that graceful-degradation behavior intact, while still letting
 * individual tests override any of these via mockImplementation(...) or
 * mockReturnValue(...) exactly as before.
 */
export const htmlElementNotFound = jest.fn(
  (_el?: unknown, context?: string) =>
    new Error(`HTMLELEMENT ERROR: ${context ?? "undetermined context"}`)
);

export const elementNotFound = jest.fn(
  (_el?: unknown, context?: string) =>
    new Error(`ELEMENT ERROR: ${context ?? "undetermined context"}`)
);

export const typeError = jest.fn(
  (_value?: unknown, context?: string) =>
    new Error(`TYPE ERROR: ${context ?? "undetermined context"}`)
);

export const numberError = jest.fn(
  (_value?: unknown, context?: string) =>
    new Error(`NUMBER ERROR: ${context ?? "undetermined context"}`)
);

export const argsError = jest.fn(
  (..._args: unknown[]) => new Error(`ARGUMENTS ERROR`)
);

export const stringError = jest.fn(
  (_fetchedStr?: unknown, expectedPattern?: string) =>
    new Error(`STRING ERROR: expected ${expectedPattern ?? "undetermined pattern"}`)
);

export const parseFinite = jest.fn(
  (value: string, context: "int" | "float" = "float", def = 0) => {
    const parsed = context === "int" ? parseInt(value) : parseFloat(value);
    return Number.isFinite(parsed) ? parsed : def;
  }
);
