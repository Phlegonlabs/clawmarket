/**
 * Result type — prefer over throw for expected errors.
 *
 * Usage:
 *   const result: Result<User, "NOT_FOUND"> = { ok: true, value: user };
 *   const error: Result<User, "NOT_FOUND"> = { ok: false, error: "NOT_FOUND" };
 */

export type Result<T, E extends string = string> =
  | { ok: true; value: T }
  | { ok: false; error: E; message?: string };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E extends string>(error: E, message?: string): Result<never, E> {
  return { ok: false, error, message };
}
