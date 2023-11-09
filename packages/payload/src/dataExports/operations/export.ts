import fs from 'fs'

import defaultAccess from '../../auth/defaultAccess'
import executeAccess from '../../auth/executeAccess'
import UnauthorizedError from '../../errors/UnathorizedError'

async function exportOperation(args): Promise<Collection> {
  const {
    overrideAccess,
    req: { payload },
    req,
    user,
  } = args

  if (!user) {
    throw new UnauthorizedError(req.t)
  }

  if (!overrideAccess) {
    await executeAccess({ req }, defaultAccess)
  }

  async function findData(id: string) {
    // 1. Call find for each collection
    // TODO: filter/search for matching collections in req.collections (passed in by frontend)
    const serverURL = req.payload.config.serverURL
    const api = req.payload.config.routes.api
    const collections = req.payload.collections
    const i18n = req.i18n
    const outputJSON = {}

    for (const collection in collections) {
      const slugObj = collections[collection].config.slug
      console.log('getting', slugObj)
      const collectionData = await req.payload.find({ collection: slugObj, limit: 1000 })

      let hasNextPage = collectionData.hasNextPage
      let currPage = collectionData.page
      while (hasNextPage) {
        const nextData = await req.payload.find({
          collection: slugObj,
          limit: 1000,
          page: currPage,
        })
        collectionData[slugObj].push(nextData[slugObj])
        currPage = nextData.page
        hasNextPage = nextData.hasNextPage
      }

      outputJSON[collections[collection].config.slug] = collectionData
    }

    // update export obj
    const fileName = '' // TODO: filename of stream
    payload.updateByID({
      id: id,
      collection: 'payload-dataExports',
      data: {
        filename: fileName,
        status: 'complete',
      },
    })

    // return stream

    // const filePath = 'data.json' // File path to save the JSON data

    // const saveJSONToFile = async () => {
    //   try {
    //     await fs.writeFile(filePath, JSON.stringify(outputJSON, null, 2), () => null)
    //     console.log('File data.json written successfully.')
    //   } catch (err) {
    //     console.error('Error writing JSON file:', err)
    //   }
    // }

    // saveJSONToFile()

    // const filestream = fs.createReadStream(filePath)
    // filestream.pipe(req)

    // filestream.on('error', function (error) {
    //   console.error('Error serving the file:', error)
    // })

    return outputJSON
  }

  const result = await payload.create({
    collection: 'payload-dataExports',
    data: {
      filename: '',
      status: 'inprogress',
      uploads: true,
    },
    user,
  })

  const objId = result.id

  // call find Data TODO: change to return result instead of data
  return await findData(objId)

  // return result
}

export default exportOperation
