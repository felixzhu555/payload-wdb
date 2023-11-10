import type { NextFunction, Response } from 'express'

import fs from 'fs'
import httpStatus from 'http-status'

import type { TypeWithID } from '../../collections/config/types'
import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'

import { isNumber } from '../../utilities/isNumber'
import exportOperation from '../operations/export'
// import exportFunc from '../operations/export'

// API ROUTE: http://localhost:3000/export , returns {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function exportHandler<T extends TypeWithID = any>(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<PaginatedDocs<T>> | void> {
  try {
    // console.log('working...')

    // Call and return operations
    const data = await exportOperation({
      req: req,
      res: res,
      user: req.user,
    })
    // console.log('HERE inside export')
    return res.status(200).json(data)
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
