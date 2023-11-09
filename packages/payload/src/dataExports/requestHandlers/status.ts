import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { TypeWithID } from '../../collections/config/types'
import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'

import { isNumber } from '../../utilities/isNumber'
import statusOperation from '../operations/status'
// import exportFunc from '../operations/export'

// API ROUTE: http://localhost:3000/export , returns {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function statusHandler<T extends TypeWithID = any>(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<PaginatedDocs<T>> | void> {
  try {
    console.log('working...')

    // Call and return operations
    const data = await statusOperation({
      req: req,
      user: req.user,
    })

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}
