import React, { useEffect, useState } from 'react'
import { Collection, SanitizedCollectionConfig } from '../../../../exports/types'
import { useConfig } from '../../utilities/Config'
import { useTranslation } from 'react-i18next'

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
    serverURL,
    routes: { admin, api },
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
    ;(async function () {
      const data = await fetch(`${serverURL}/export`, {
        credentials: 'include',
        headers: {
          'Accept-Language': i18n.language,
        },
      })
      return await data.json()
    })()
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  return (
    <>
      LIST:
      {collections.map((collection) => (
        <>
          <br />
          Collection name: {collection.slug}
        </>
      ))}
    </>
  )
}

export default Export
