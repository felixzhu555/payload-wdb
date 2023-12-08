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
    // if (!(collectionSlug === 'posts' || collectionSlug === 'users')) {
    //   continue
    // }
    const selected = checkedCollectionsArr[collectionSlug][0]
    if (!selected) {
      continue
    }
    const versionsSelected = checkedCollectionsArr[collectionSlug][1]
    const publishedSelected = checkedCollectionsArr[collectionSlug][2]
    const draftSelected = checkedCollectionsArr[collectionSlug][3]

    // Output data
    const collectionJSON = {}
    if (draftSelected) {
      // ensure versions enabled
      const draftData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        overrideAccess: true,
        where: {
          _status: {
            equals: 'draft',
          },
        },
      })
      let hasNextPage = draftData.hasNextPage
      let currPage = draftData.page

      while (hasNextPage) {
        const nextDraftData = await req.payload.find({
          collection: collectionSlug,
          limit: 1000,
          overrideAccess: true,
          page: currPage + 1,
          where: {
            _status: {
              equals: 'draft',
            },
          },
        })
        if (!(collectionSlug in draftData)) {
          draftData[collectionSlug] = []
        }
        if (nextDraftData[collectionSlug]) {
          draftData[collectionSlug].push(nextDraftData[collectionSlug].docs)
        }
        currPage = nextDraftData.page
        hasNextPage = nextDraftData.hasNextPage
      }
      collectionJSON['drafts'] = draftData.docs
    }
    if (publishedSelected) {
      const publishData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        locale: 'en',
        overrideAccess: true,
        where: {
          _status: {
            equals: 'published',
          },
        },
      })

      let hasNextPage = publishData.hasNextPage
      let currPage = publishData.page

      while (hasNextPage) {
        const nextPublishData = await req.payload.find({
          collection: collectionSlug,
          limit: 1000,
          locale: 'en',
          overrideAccess: true,
          page: currPage + 1,
          showHiddenFields: true,
          where: {
            _status: {
              equals: 'published',
            },
          },
        })
        if (!(collectionSlug in publishData)) {
          publishData[collectionSlug] = []
        }
        if (nextPublishData[collectionSlug]) {
          publishData[collectionSlug].push(nextPublishData[collectionSlug]).docs
        }
        currPage = nextPublishData.page
        hasNextPage = nextPublishData.hasNextPage
      }
      collectionJSON['published'] = publishData.docs
    }
    if (versionsSelected) {
      const versionData = await req.payload.findVersions({
        collection: collectionSlug,
        limit: 1000,
        locale: 'en',
        overrideAccess: true,
        showHiddenFields: true,
        where: {},
      })

      let hasNextPage = versionData.hasNextPage
      let currPage = versionData.page

      while (hasNextPage) {
        const nextVersionData = await req.payload.findVersions({
          collection: collectionSlug,
          limit: 1000,
          locale: 'en',
          overrideAccess: true,
          page: currPage + 1,
          showHiddenFields: true,
        })

        if (!(collectionSlug in versionData)) {
          versionData[collectionSlug] = []
        }
        if (nextVersionData[collectionSlug]) {
          versionData[collectionSlug].push(nextVersionData[collectionSlug].docs)
        }
        currPage = nextVersionData.page
        hasNextPage = nextVersionData.hasNextPage
      }
      collectionJSON['versions'] = versionData.docs
    }

    const mainCollectionData = await req.payload.find({
      collection: collectionSlug,
      limit: 1000,
      overrideAccess: true,
      showHiddenFields: true,
    })

    let hasNextPage = mainCollectionData.hasNextPage
    let currPage = mainCollectionData.page

    while (hasNextPage) {
      const nextData = await req.payload.find({
        collection: collectionSlug,
        limit: 1000,
        overrideAccess: true,
        page: currPage + 1,
        showHiddenFields: true,
      })
      if (!(collectionSlug in mainCollectionData)) {
        mainCollectionData[collectionSlug] = []
      }
      if (nextData[collectionSlug]) {
        mainCollectionData[collectionSlug].push(nextData[collectionSlug].docs)
      }
      currPage = nextData.page
      hasNextPage = nextData.hasNextPage
    }
    collectionJSON['collection'] = mainCollectionData.docs

    outputJSON[collectionSlug] = collectionJSON
  }
  console.log(outputJSON)
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
              overrideAccess: true,
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
                overrideAccess: true,
                req: args.req,
              })
            })
          console.log('returning buffer1')

          return data
        }
      },
    ],
  },
  slug: 'data-exports',
}

export default getDataExportsCollection
