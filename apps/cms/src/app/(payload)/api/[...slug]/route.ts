/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { RenderRouteWithFallback } from '@payloadcms/next/routes'

type Args = {
  params: Promise<{
    slug: string[]
  }>
}

export const GET = RenderRouteWithFallback({ config, method: 'GET' })
export const POST = RenderRouteWithFallback({ config, method: 'POST' })
export const DELETE = RenderRouteWithFallback({ config, method: 'DELETE' })
export const PATCH = RenderRouteWithFallback({ config, method: 'PATCH' })
export const PUT = RenderRouteWithFallback({ config, method: 'PUT' })
export const OPTIONS = RenderRouteWithFallback({ config, method: 'OPTIONS' })
