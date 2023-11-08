import defaultAccess from '../../auth/defaultAccess'
import executeAccess from '../../auth/executeAccess'
import UnauthorizedError from '../../errors/UnathorizedError'

async function create(args) {
  const {
    key,
    overrideAccess,
    req: { payload },
    req,
    user,
    value,
  } = args

  const exportData = {}

  //RAY: THIS IS HARDCODED FOR NOW, BUT NEED TO FIGURE OUT HOW TO GET THE COLLECTIONS FROM RES
  const collectionsToExport = ['users', 'posts', 'comments']

  //create a json of each collection

  collectionsToExport.forEach(async (collection) => {
    try {
      const { docs } = await payload.find({
        collection,
        depth: 0,
        pagination: false,
        user,
        where: {},
      })
      exportData[collection] = JSON.stringify(docs)
    } catch (e) {
      console.log(e)
    }
  })

  const result = await payload.create({
    collection: 'payload-dataExports',
    data: {
      name: `export-${Date.now()}`,
      value: exportData,
    },
    user,
  })

  return result
}

export default create
