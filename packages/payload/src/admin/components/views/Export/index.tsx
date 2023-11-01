import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Collection } from '../../../../exports/types'

import { SanitizedCollectionConfig } from '../../../../exports/types'
import { useConfig } from '../../utilities/Config'
import ExportList from './ExportList/index'

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

  const [collectionsDict, setCollectionsDict] = useState({})
  const [dataFromChild, setDataFromChild] = useState(null)

  const handleDataFromChild = (data) => {
    // Process the data received from the child component
    setDataFromChild(data)
  }

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

  useEffect(() => {
    const updatedCollectionsDict = {}
    const dummyVersions = ['1.0', '1.2']
    for (const collection of collections) {
      if (collection.labels && collection.labels.plural) {
        const tempKey = collection.labels.plural
        let tempBucket = {}
        tempBucket['slug'] = collection.slug
        tempBucket['versions'] = dummyVersions
        updatedCollectionsDict[tempKey] = tempBucket
      }
    }
    setCollectionsDict(updatedCollectionsDict)
  }, [collections])

  if (collectionsDict && Object.keys(collectionsDict).length > 0) {
    return (
      <React.Fragment>
        <div>
          <div>
            <ExportList collectionsDict={collectionsDict}></ExportList>
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return <p>Fetching Data...</p>
  }
}

export default Export
