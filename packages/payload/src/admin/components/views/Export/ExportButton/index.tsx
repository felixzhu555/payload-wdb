import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Collection } from '../../../../../exports/types'

import { SanitizedCollectionConfig } from '../../../../../exports/types'
import { useAuth } from '../../../utilities/Auth'
import { useConfig } from '../../../utilities/Config'
import './index.scss'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ExportType = {
  collections: Array<Collection>
}

function ExportButton(props) {
  const { selectedVersions } = props
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
    const toastId = toast.info(`Exporting`)

    let empty = true
    for (const i in selectedVersions) {
      console.log(selectedVersions[i])
      if (selectedVersions[i] && selectedVersions[i].length !== 0) {
        empty = false
        break
      }
    }
    if (empty == true) {
      setTimeout(() => {
        toast.update(toastId, {
          autoClose: 3000,
          render: 'No Collections Selected!',
          type: 'error',
        })
      }, 2000)
      throw new Error('No Collections Selected')
    }

    try {
      const response = await fetch(
        `${serverURL}/api/data-exports?collections=${JSON.stringify(
          selectedVersions,
        ).toLowerCase()}`,
        {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
          method: 'POST',
        },
      )

      if (!response.ok) {
        setTimeout(() => {
          toast.update(toastId, {
            autoClose: 3000,
            render: `Response was not ok!`,
            type: 'error',
          })
        }, 2000)
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
      setTimeout(() => {
        toast.update(toastId, {
          autoClose: 3000,
          render: `Exporting Completed!`,
          type: toast.TYPE.SUCCESS,
        })
      }, 2000)
    } catch (error) {
      console.error('Error downloading data:', error)
    }
  }

  return (
    <div className="dropdown-container">
      <button className="download-button" onClick={downloadData} type="button">
        Download
      </button>
    </div>
  )
}

export default ExportButton
