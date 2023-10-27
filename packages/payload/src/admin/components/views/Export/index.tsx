import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Collection } from '../../../../exports/types'

import { SanitizedCollectionConfig } from '../../../../exports/types'
import { useConfig } from '../../utilities/Config'
import { ExportList } from './ExportList'
import { ExportSearch } from './ExportSearch'

type ExportType = {
  collections: Array<Collection>
}

const Export = () => {
  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks },
    },
    // collections is a list of collectionConfigs,
    //    which is what should be rendered in the list
    collections,
    globals,
    routes: { admin, api },
    serverURL,
  } = useConfig()
  const { i18n } = useTranslation('general')
  const [data, setData] = useState<ExportType>()

  const exportData = () => {
    // TODO: not finished
    collections.forEach((collection) => {
      ;(async function () {
        const data = await fetch(`${serverURL}${api}/${collection.slug}`, {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
        })
        return await data.json()
      })()
        .then((res) => {
          console.log(collection.slug, res)
          // const newData = data || {}
          // if (newData) {
          //   newData[collection.slug] = res
          //   setData(newData)
          // }
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  useEffect(() => {
    // exportData()
  }, [])

  return (
    <React.Fragment>
      LIST:
      {collections.map((collection) => (
        <React.Fragment>
          <br />
          Collection name: {collection.slug}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default Export
