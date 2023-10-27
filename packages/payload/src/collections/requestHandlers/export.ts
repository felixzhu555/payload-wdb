import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'
import type { TypeWithID } from '../config/types'

import { isNumber } from '../../utilities/isNumber'
import exportFunc from '../operations/export'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function exportHandler<T extends TypeWithID = any>(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<PaginatedDocs<T>> | void> {
  try {
    // let page: number | undefined

    // if (typeof req.query.page === 'string') {
    //   const parsedPage = parseInt(req.query.page, 10)

    //   if (!Number.isNaN(parsedPage)) {
    //     page = parsedPage
    //   }
    // }

    // const result = await exportFunc({
    //   data: req.data,
    // })

    result = 'HELLO WORLD'

    return res.status(httpStatus.OK)
  } catch (error) {
    return next(error)
  }
}
