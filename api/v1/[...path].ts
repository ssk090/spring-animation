export const config = { runtime: 'edge' }

const TARGET = 'https://api.typesafe.ai'

// Same-origin proxy for the TypeSafe API, which sends no CORS headers.
// The browser calls /api/v1/systemone, this forwards it upstream.
export default async function handler(request: Request): Promise<Response> {
  const { pathname, search } = new URL(request.url)
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'

  return fetch(`${TARGET}${pathname.replace(/^\/api/, '')}${search}`, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
  })
}
