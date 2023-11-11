import defaultAccess from '../../auth/defaultAccess'
import executeAccess from '../../auth/executeAccess'
import UnauthorizedError from '../../errors/UnathorizedError'

async function exportOperation(args): Promise<Collection> {
  const {
    overrideAccess,
    req: { payload },
    req,
    res,
    user,
  } = args

  // if (!user) {
  //   throw new UnauthorizedError(req.t)
  // }

  // if (!overrideAccess) {
  //   await executeAccess({ req }, defaultAccess)
  // }
  console.log('INSIDE EXPORT OPERATION')
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

    console.log('outputJSON', outputJSON)
    // update export obj
    const fileName = '' // TODO: filename of stream
    payload.update({
      id: id,
      collection: 'payload-dataExports',
      data: {
        filename: fileName,
        status: 'complete',
      },
    })

    return outputJSON
  }

  const result = await payload.create({
    collection: 'payload-dataExports',
    data: {
      filename: '',
      status: 'inprogress',
      uploads: false,
    },
    req: req,
    user: user,
  })

  const objId = result.id

  // call find Data TODO: change to return result instead of data
  return await findData(objId)

  // return result
}

export default exportOperation
