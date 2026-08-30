import type { ErrorRequestHandler } from 'express'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500
  const message = error instanceof Error ? error.message : 'Something went wrong'

  response.status(statusCode).json({ error: message })
}
