//user permissions and access for data export???
import type { CollectionConfig } from '../collections/config/types'
import type { Access, Config } from '../config/types'

import exportHandler from './requestHandlers/export'
import statusHandler from './requestHandlers/status'

const dataExportAccess: Access = ({ req }) => ({
  'user.value': {
    equals: req?.user?.id,
  },
})

const getDataExportsCollection = (config: Config): CollectionConfig => ({
  access: {
    delete: dataExportAccess,
    read: dataExportAccess,
  },
  admin: {
    hidden: false,
  },
  endpoints: [
    {
      handler: exportHandler,
      method: 'post',
      path: '/export',
    },
    {
      handler: statusHandler,
      method: 'get',
      path: '/status/:id',
    },
  ],
  fields: [
    // {
    //   name: 'user',
    //   hooks: {
    //     beforeValidate: [
    //       ({ req }) => {
    //         if (!req?.user) {
    //           return null
    //         }
    //         return {
    //           relationTo: req?.user.collection,
    //           value: req?.user.id,
    //         }
    //       },
    //     ],
    //   },
    //   relationTo: config.collections
    //     .filter((collectionConfig) => collectionConfig.auth)
    //     .map((collectionConfig) => collectionConfig.slug),
    //   required: true,
    //   type: 'relationship',
    // },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'filename',
      type: 'text',
    },
    {
      name: 'uploads',
      type: 'text',
    },
  ],
  slug: 'payload-dataExports', //payload-preferences for getPreferencesCollection
  upload: true,
})

export default getDataExportsCollection
