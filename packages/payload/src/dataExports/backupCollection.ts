import type { CollectionConfig } from '../collections/config/types'
import type { Access, Config } from '../config/types'

import exportHandler from './requestHandlers/export'
import statusHandler from './requestHandlers/status'

const getBackupCollection: CollectionConfig = {
  admin: {
    // hidden: true,
  },
  fields: [],
  slug: 'backup',
  upload: true,
}

export default getBackupCollection
