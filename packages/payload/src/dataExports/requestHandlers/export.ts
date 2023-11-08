import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { TypeWithID } from '../../collections/config/types'
import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'

import { isNumber } from '../../utilities/isNumber'
// import exportFunc from '../operations/export'

// API ROUTE: http://localhost:3000/export , returns {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function exportHandler<T extends TypeWithID = any>(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<PaginatedDocs<T>> | void> {
  try {
    console.log('working...')
    // console.log(req)

    // 1. Call find for each collection
    // TODO: NOT WORKING
    const serverURL = req.payload.config.serverURL
    const api = req.payload.config.routes.api
    const collections = req.payload.collections
    const i18n = req.i18n
    const outputJSON = {}

    for (const collection in collections) {
      console.log('getting', collections[collection].config.slug)
      const data = req.payload.find({ collection: collections[collection].config.slug })

      //   // 2. filter/search for matching collections in req.collections (passed in by frontend)
      outputJSON[collections[collection].config.slug] = data
    }

    // 3. return stream of json

    return res.status(200).json(outputJSON)
  } catch (error) {
    return next(error)
  }
}
