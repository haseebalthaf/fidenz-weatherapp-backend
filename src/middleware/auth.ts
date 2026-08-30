import type { NextFunction, Request, Response } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export function getAuthConfig() {
  const auth0Domain = process.env.AUTH0_DOMAIN
  const auth0Audience = process.env.AUTH0_AUDIENCE
  const auth0Keys = auth0Domain
    ? createRemoteJWKSet(new URL(`https://${auth0Domain}/.well-known/jwks.json`))
    : undefined

  return { auth0Domain, auth0Audience, auth0Keys }
}

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { auth0Domain, auth0Audience, auth0Keys } = getAuthConfig()

  if (!auth0Domain || !auth0Audience || !auth0Keys) {
    response.status(500).json({ error: 'Auth0 is not configured' })
    return
  }

  const authorizationHeader = request.headers.authorization
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : undefined

  if (!token) {
    response.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    await jwtVerify(token, auth0Keys, {
      issuer: `https://${auth0Domain}/`,
      audience: auth0Audience,
    })

    next()
  } catch {
    response.status(401).json({ error: 'Invalid or expired token' })
  }
}
