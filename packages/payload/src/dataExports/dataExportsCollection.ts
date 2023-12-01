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

  /*
  checkedCollectionsArr =
  {
    "posts": [true, true, false],
    "users": [true, false, false],
  }
  */

  /*  
    TODO: need frontend to send us the checked collections, currently unchecked collections are still being sent.
  */

  for (const collectionSlug of Object.keys(checkedCollectionsArr)) {
    const versionsSelected = checkedCollectionsArr[collectionSlug][0]
    const draftSelected = checkedCollectionsArr[collectionSlug][1]
    const publishedSelected = checkedCollectionsArr[collectionSlug][2]
    /*
    
      cases: (not sure what each case do)
        - versionsSelected && draftSelected
        - versionsSelected && publishedSelected
        - !versionsSelected && !draftSelected && !publishedSelected
    */
    if (versionsSelected && draftSelected) {
      const collectionData = await req.payload.findVersions({
        collection: collectionSlug,
        limit: 1000,
        overrideAccess: true,
        where: {
          _status: {
            equals: 'draft',
          },
        },
      })

      let hasNextPage = collectionData.hasNextPage
      let currPage = collectionData.page

      while (hasNextPage) {
        const nextData = await req.payload.findVersions({
          collection: collectionSlug,
          limit: 1000,
          overrideAccess: true,
          page: currPage + 1,
        })
        collectionData[collectionSlug].push(nextData[collectionSlug])
        currPage = nextData.page
        hasNextPage = nextData.hasNextPage
      }

      outputJSON[collectionSlug] = [collectionData]
    } else if (versionsSelected && publishedSelected) {
      const collectionData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        locale: 'en',
        overrideAccess: true,
        showHiddenFields: true,
        where: {
          _status: {
            equals: 'published',
          },
        },
      })

      let hasNextPage = collectionData.hasNextPage
      let currPage = collectionData.page

      while (hasNextPage) {
        const nextData = await req.payload.find({
          collection: collectionSlug,
          limit: 1000,
          locale: 'en',
          overrideAccess: true,
          page: currPage + 1,
          showHiddenFields: true,
        })
        collectionData[collectionSlug].push(nextData[collectionSlug])
        currPage = nextData.page
        hasNextPage = nextData.hasNextPage
      }
      outputJSON[collectionSlug] = [collectionData]
    } else {
      const collectionData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        overrideAccess: true,
        showHiddenFields: true,
      })

      let hasNextPage = collectionData.hasNextPage
      let currPage = collectionData.page

      while (hasNextPage) {
        const nextData = await req.payload.find({
          collection: collectionSlug,
          limit: 1000,
          overrideAccess: true,
          page: currPage + 1,
          showHiddenFields: true,
        })
        collectionData[collectionSlug].push(nextData[collectionSlug])
        currPage = nextData.page
        hasNextPage = nextData.hasNextPage
      }
      outputJSON[collectionSlug] = [collectionData] // Ensure this is an array
    }
  }

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
