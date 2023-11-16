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
  const { permissions, user } = useAuth()
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

  const generateRandomVersions = (count) => {
    const randomVersions = []
    const generateUniqueVersion = () => {
      const version = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
      return randomVersions.includes(version) ? generateUniqueVersion() : version
    }
    for (let i = 1; i <= count; i++) {
      const uniqueVersion = generateUniqueVersion()
      randomVersions.push(uniqueVersion)
    }
    return randomVersions.sort((a, b) => parseFloat(a) - parseFloat(b))
  }

  function getRandomCountWithDistribution() {
    const randomNumber = Math.floor(Math.random() * 100) + 1
    if (randomNumber <= 10) {
      return 1 // 10%
    } else if (randomNumber <= 35) {
      return 2 // 25%
    } else if (randomNumber <= 65) {
      return 3 // 30%
    } else if (randomNumber <= 85) {
      return 4 // 20%
    } else {
      return 5 // 15%
    }
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
        const tempKey = collection.labels.plural
        const tempBucket = {}
        tempBucket['slug'] = collection.slug
        const randomCount = getRandomCountWithDistribution()
        tempBucket['versions'] = generateRandomVersions(randomCount) // Change the argument to generate more or fewer versions
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
