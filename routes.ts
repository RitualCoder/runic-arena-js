/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to the home page.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/new-password",
];

/**
 * The prefix for the API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string[]}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect route after a user logs in.
 * @type {string[]}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";
