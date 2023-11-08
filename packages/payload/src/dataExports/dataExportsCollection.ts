//user permissions and access for data export???
import type { CollectionConfig } from '../collections/config/types'
import type { Access, Config } from '../config/types'

import deleteHandler from './requestHandlers/delete'
import exportHandler from './requestHandlers/export'
import findHandler from './requestHandlers/find'

const dataExportAccess: Access = ({ req }) => ({
  'user.value': {
    equals: req?.user?.id,
  },
})

const getDataExportsCollection = (config: Config): CollectionConfig => ({
  access: {
    delete: dataExportAccess,
    create: dataExportAccess,
    read: dataExportAccess,
  },
  admin: {
    hidden: false,
  },
  endpoints: [
    {
      handler: exportHandler,
      method: 'post',
      path: '/create',
    },
    {
      handler: findHandler,
      method: 'get',
      path: '/:key',
    },
    {
      handler: deleteHandler,
      method: 'delete',
      path: '/:key',
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
      name: 'name',
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
