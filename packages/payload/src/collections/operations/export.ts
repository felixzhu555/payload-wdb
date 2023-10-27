import type { AccessResult } from '../../config/types'
import type { PaginatedDocs } from '../../database/types'
import type { PayloadRequest } from '../../express/types'
import type { Where } from '../../types'
import type { Collection, TypeWithID } from '../config/types'

import executeAccess from '../../auth/executeAccess'
import { combineQueries } from '../../database/combineQueries'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths'
import { afterRead } from '../../fields/hooks/afterRead'
import { initTransaction } from '../../utilities/initTransaction'
import { killTransaction } from '../../utilities/killTransaction'
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields'
import { appendVersionToQueryKey } from '../../versions/drafts/appendVersionToQueryKey'
import { getQueryDraftsSort } from '../../versions/drafts/getQueryDraftsSort'
import find from './find'
import { buildAfterOperation } from './utils'

export type Arguments = {
  collection: Collection
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  draft?: boolean
  limit?: number
  overrideAccess?: boolean
  page?: number
  pagination?: boolean
  req?: PayloadRequest
  showHiddenFields?: boolean
  sort?: string
  where?: Where
}

async function exportFunc<T extends TypeWithID & Record<string, unknown>>(
  incomingArgs: Arguments,
): Promise<PaginatedDocs<T>> {
  const args = incomingArgs

  try {
    return 'One'
  } catch {
    return 'two'
  }

  // return args;
}

export default exportFunc
