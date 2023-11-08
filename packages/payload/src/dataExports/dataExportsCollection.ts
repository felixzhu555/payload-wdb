//user permissions and access for data export???
import type { CollectionConfig } from '../collections/config/types'
import type { Access, Config } from '../config/types'

import exportHandler from './requestHandlers/export'

const dataExportAcess: Access = ({ req }) => ({
  'user.value': {
    equals: req?.user?.id,
  },
})

const getDataExportsCollection = (config: Config): CollectionConfig => ({
  access: {
    delete: dataExportAcess,
    read: dataExportAcess,
  },
  admin: {
    hidden: true,
  },
  endpoints: [
    {
      handler: exportHandler,
      method: 'post',
      path: '/export',
    },
  ],
  fields: [
    {
      name: 'user',
      hooks: {
        beforeValidate: [
          ({ req }) => {
            if (!req?.user) {
              return null
            }
            return {
              relationTo: req?.user.collection,
              value: req?.user.id,
            }
          },
        ],
      },
      relationTo: config.collections
        .filter((collectionConfig) => collectionConfig.auth)
        .map((collectionConfig) => collectionConfig.slug),
      required: true,
      type: 'relationship',
    },
    {
      name: 'key',
      type: 'text',
    },
    {
      name: 'value',
      type: 'json',
    },
  ],
  slug: 'payload-dataExports', //payload-preferences for getPreferencesCollection
  upload: true,
})

export default getDataExportsCollection
