import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Collection } from '../../../../exports/types'

import { SanitizedCollectionConfig } from '../../../../exports/types'
import { useAuth } from '../../utilities/Auth'
import { useConfig } from '../../utilities/Config'

type ExportType = {
  collections: Array<Collection>
}

const Export = () => {
  const { permissions, user } = useAuth()
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
      console.log(collection.slug)
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
      const data = await fetch(`${serverURL}/api/data-exports?collections=[users,posts]`, {
        body: JSON.stringify({ collections: ['users', 'posts'] }),
        credentials: 'include',
        headers: {
          'Accept-Language': i18n.language,
        },
        method: 'POST',
      })
      async function downloadFromStream(stream) {
        // Convert the ReadableStream into a Blob
        const blob = await new Response(stream).blob()

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob)

        // Create a temporary anchor element
        const a = document.createElement('a')
        a.href = url

        // Set a filename for the downloaded file
        a.download = 'downloaded_file.json' // You can change the filename here

        // Append the anchor to the document
        document.body.appendChild(a)

        // Trigger the download
        a.click()

        // Clean up by revoking the URL and removing the anchor element
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
      downloadFromStream(data.body)
    })()
    // .then((res) => {
    //   console.log(res)
    //   console.log('getting stuff')
    //   const data1 = fetch(`${serverURL}/api/data-exports/` + res.doc.id, {
    //     credentials: 'include',
    //     headers: {
    //       'Accept-Language': i18n.language,
    //     },
    //     method: 'GET',
    //   }).then((r) => {
    //     console.log(r)
    //   })
    // })
    // .catch((e) => {
    //   console.log(e)
    // })
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
