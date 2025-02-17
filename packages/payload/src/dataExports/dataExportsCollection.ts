//user permissions and access for data export???
import type { CollectionConfig } from '../collections/config/types'
import type { Access, Config } from '../config/types'
import type { PayloadRequest } from '../express/types'

import statusHandler from './requestHandlers/status'

async function findData(req: PayloadRequest) {
  const serverURL = req.payload.config.serverURL
  const api = req.payload.config.routes.api
  const collections = req.payload.collections
  const i18n = req.i18n
  const outputJSON = {}

  console.log('request: ', req.query['collections'])

  const checkedCollectionsArr = JSON.parse(req.query['collections'])
  console.log(checkedCollectionsArr, typeof checkedCollectionsArr)

  for (const collectionSlug of Object.keys(checkedCollectionsArr)) {
    for (const version of checkedCollectionsArr[collectionSlug]) {
      const collectionData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        where: {
          version: version,
        },
      })

      let hasNextPage = collectionData.hasNextPage
      let currPage = collectionData.page

      while (hasNextPage) {
        const nextData = await req.payload.find({
          collection: collectionSlug,
          limit: 1000,
          page: currPage + 1,
          where: {
            version: version,
          },
        })

        // Assuming collectionData is an array and you want to concatenate the results
        collectionData[collectionSlug].push(nextData[collectionSlug])
        currPage = nextData.page
        hasNextPage = nextData.hasNextPage
      }
      collectionData['version'] = version
      // Append to outputJSON key if it exists, otherwise create it
      if (outputJSON[collectionSlug]) {
        outputJSON[collectionSlug].push(collectionData)
      } else {
        outputJSON[collectionSlug] = [collectionData] // Ensure this is an array
      }
    }
  }

  // for (const idx in checkedCollectionsArr) {
  //   const collectionSlug = checkedCollectionsArr[idx]
  //   const collectionData = await req.payload.find({ collection: collectionSlug, limit: 1000 })

  //   let hasNextPage = collectionData.hasNextPage
  //   let currPage = collectionData.page
  //   while (hasNextPage) {
  //     const nextData = await req.payload.find({
  //       collection: collectionSlug,
  //       limit: 1000,
  //       page: currPage,
  //     })
  //     collectionData[collectionSlug].push(nextData[collectionSlug])
  //     currPage = nextData.page
  //     hasNextPage = nextData.hasNextPage
  //   }

  //   outputJSON[collectionSlug] = collectionData
  // }

  // console.log('outputJSON', outputJSON)

  return outputJSON
}

const getDataExportsCollection: CollectionConfig = {
  admin: {
    useAsTitle: 'createdAt',
  },
  endpoints: [
    {
      handler: statusHandler,
      method: 'get',
      path: '/:id',
    },
  ],
  fields: [
    {
      name: 'file',
      relationTo: 'backup',
      type: 'upload',
    },
    {
      name: 'options',
      type: 'json',
    },
  ],
  hooks: {
    afterOperation: [
      async ({ args, operation, result }) => {
        if (operation === 'create') {
          let buffer: Buffer = Buffer.from('{', 'utf-8')
          const data = await findData(args.req)

          for (const collection in data) {
            const collectionData = data[collection]
            buffer = Buffer.concat([
              buffer,
              Buffer.from(`"${collection}": ${JSON.stringify(collectionData['docs'])}`, 'utf-8'),
            ])
            buffer = Buffer.concat([buffer, Buffer.from(',', 'utf-8')])
          }
          buffer = Buffer.concat([buffer, Buffer.from('}', 'utf-8')])

          args.req.payload
            .create({
              collection: 'backup',
              data: {},
              file: {
                name: 'test.json', // eventually set to timestamp
                data: buffer,
                mimetype: 'application/json',
                size: buffer.byteLength,
              },
              req: args.req,
            })
            .then((backup) => {
              console.log('creating backup')
              args.req.payload.update({
                id: result.id,
                collection: 'data-exports',
                data: {
                  file: backup.id,
                },
                req: args.req,
              })
            })
          console.log('returning buffer1')
          // update this created export with the relationship to the file

          return data
        }
      },
    ],
  },
  slug: 'data-exports',
}

export default getDataExportsCollection
