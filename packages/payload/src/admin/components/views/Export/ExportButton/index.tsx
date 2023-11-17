import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Collection } from '../../../../../exports/types'

import { SanitizedCollectionConfig } from '../../../../../exports/types'
import { useAuth } from '../../../utilities/Auth'
import { useConfig } from '../../../utilities/Config'

type ExportType = {
  collections: Array<Collection>
}

import './index.scss'

function ExportButton() {
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
  const [data, setData] = useState<ExportType | undefined>()

  const downloadData = async () => {
    try {
      const response = await fetch(
        `${serverURL}/api/data-exports?collections={"users": ["1.1", "1.2"], "posts": ["1.1"]}`,
        {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
          method: 'POST',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.blob()
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      const currentDateTime = new Date()
      const dateTimeString = currentDateTime.toString()
      a.download = dateTimeString + '.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading data:', error)
    }
  }

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={downloadData} type="button">
        Download
      </button>
    </div>
  )
}

export default ExportButton
