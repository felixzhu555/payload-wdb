import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'
import type { TypeWithID } from '../config/types'
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
    // const serverURL = req.payload.config.serverURL;
    // const api = req.payload.config.routes.api;
    // const collections = req.payload.collections;
    // const i18n = req.i18n;
    // let outputJSON = {}

    // for (const collection in collections) {
    //   const data = await fetch(`${serverURL}${api}/${(collections[collection]).config.slug}`, {
    //     credentials: 'include',
    //     headers: {
    //       'Accept-Language': i18n.language,
    //     },
    //   })

    //   const findResponse = await data.json()

    //   findResponse.then(r => {
    //     // console.log("ReSPONSE OBJECT ", r)
    //     // 2. filter/search for matching collections in req.collections (passed in by frontend)
    //     outputJSON[(collections[collection]).config.slug] = r
    //   })
    // }
    // console.log('bet')

    // 3. return stream of json

    return res.status(200).json({})
  } catch (error) {
    return next(error)
  }
}
