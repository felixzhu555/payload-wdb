import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { GeneratedTypes } from '../../'
import type { PayloadRequest } from '../../express/types'

import find from '../operations/find'

export default async function findHandler(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<GeneratedTypes['collections']['_preference']> | void> {
  try {
    const result = await find({
      key: req.params.key,
      req,
      user: req.user,
    })

    return res
      .status(httpStatus.OK)
      .json(result || { message: req.t('general:notFound'), value: null })
  } catch (error) {
    return next(error)
  }
}
