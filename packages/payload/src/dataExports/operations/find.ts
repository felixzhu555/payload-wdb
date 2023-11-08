import type { GeneratedTypes } from '../../'
import type { Where } from '../../types'
import type { PreferenceRequest } from '../types'
//finds a single file based on name
async function find(
  args: PreferenceRequest,
): Promise<GeneratedTypes['collections']['_preference']> {
  const {
    key,
    req: { payload },
    user,
  } = args

  if (!user) return null

  //RAY: probably need a custom where clause here
  const where: Where = {
    and: [{ key: { equals: key } }],
  }

  const { docs } = await payload.find({
    collection: 'payload-dataExports',
    depth: 0,
    pagination: false,
    user,
    where,
  })

  if (docs.length === 0) return null

  return docs[0]
}

export default find
