/**
 * Wire into apps/create/server/index.mjs (or this repo's server/index.mjs):
 *
 *   import './load-env.mjs'
 *   import { registerOwnerUserRoutes } from './ownerUsers.mjs'
 *   ...
 *   registerOwnerUserRoutes(app)
 *
 * Files live at:
 *   apps/create/server/ownerUsers.mjs
 *   apps/create/server/load-env.mjs
 * (copies also kept at repo-root server/ for PixelWave create API)
 */

export { registerOwnerUserRoutes } from './ownerUsers.mjs'
