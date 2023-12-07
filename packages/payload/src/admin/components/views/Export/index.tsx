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
    collections,
    globals,
    routes: { admin, api },
    serverURL,
  } = useConfig()
  const { i18n } = useTranslation('general')

  const [collectionsDict, setCollectionsDict] = useState({})
  const [dataFromChild, setDataFromChild] = useState(null)

  const handleDataFromChild = (data) => {
    // Process the data received from the child component
    setDataFromChild(data)
  }

  const exportData = async () => {
    const newData = {}
    for (const collection of collections) {
      try {
        const response = await fetch(`${serverURL}${api}/${collection.slug}`, {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
        })
        const data = await response.json()
        newData[collection.slug] = data
      } catch (error) {
        console.error(`Error fetching data for ${collection.slug}:`, error)
      }
    }
  }

  useEffect(() => {
    exportData()
  }, [])

  useEffect(() => {
    const updatedCollectionsDict = {}
    for (const collection of collections) {
      if (collection.labels && collection.labels.plural) {
        let enableVersions = false
        let enableDrafts = false
        if (collection.versions) {
          enableVersions = true
          if (collection.versions.drafts) {
            enableDrafts = true
          }
        }

        const tempKey = collection.labels.plural
        updatedCollectionsDict[tempKey] = [enableVersions, enableDrafts]
      }
    }
    setCollectionsDict(updatedCollectionsDict)
  }, [collections])

  console.log(collectionsDict)
  if (collectionsDict && Object.keys(collectionsDict).length > 0) {
    return (
      <React.Fragment>
        <div>
          <div>
            <ExportList collectionsDict={collectionsDict} onDataChange={handleDataFromChild} />
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return <p>Fetching Data...</p>
  }
}

export default Export
