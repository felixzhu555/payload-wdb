import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { TypeWithID } from '../../collections/config/types'
import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'

import { isNumber } from '../../utilities/isNumber'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function statusHandler<T extends TypeWithID = any>(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<PaginatedDocs<T>> | void> {
  try {
    console.log('working...')

    const obj = await req.payload.findByID({
      id: req.params.id,
      collection: 'data-exports',
      req: req,
    })

    if (obj['file'] && obj['file']['filename']) {
      return res.status(200).send({ status: 'done!' })
    }

    return res.status(200).send({ status: 'waiting' }) // you can pass json object as param in .send() and will download .json via stream with contents of object
  } catch (error) {
    return next(error)
  }
}
