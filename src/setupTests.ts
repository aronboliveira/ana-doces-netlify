import "@testing-library/jest-dom";

// Lets React's `act()` work for tests that drive a raw createRoot directly
// (not through @testing-library/react's own render(), which sets this
// itself) -- without it, act() silently doesn't flush updates.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
