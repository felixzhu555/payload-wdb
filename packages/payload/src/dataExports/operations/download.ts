import fs from 'fs'
import mime from 'mime'
import path from 'path'

import defaultAccess from '../../auth/defaultAccess'
import executeAccess from '../../auth/executeAccess'
import UnauthorizedError from '../../errors/UnathorizedError'

async function download(args) {
  const {
    key, // This should be the identifier of the file to download
    overrideAccess,
    req: { payload },
    req,
    user,
  } = args

  const collection = 'payload-dataExports'

  const filter = {
    key: { equals: key },
  }

  if (!user) {
    throw new UnauthorizedError('You are not authorized to access this file.')
  }

  if (!overrideAccess) {
    await executeAccess({ req }, defaultAccess)
  }

  let exportFileEntry
  exportFileEntry = await payload.db.find({
    collection,
    limit: 1,
    where: filter,
  })

  if (!exportFileEntry || exportFileEntry.length === 0) {
    throw new Error('File not found.')
  }

  const jsonString = JSON.stringify(exportFileEntry.value, null, 2)

  req.res.setHeader('Content-Disposition', `attachment; filename="${name}.json"`)
  req.res.setHeader('Content-Type', 'application/json')

  req.res.send(jsonString)
}

export default download
