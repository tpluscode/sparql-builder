export class QueryError extends Error {
  constructor(public query: string, cause: unknown) {
    super(`Error executing query: ${(cause as Error)?.message}`)
  }
}
