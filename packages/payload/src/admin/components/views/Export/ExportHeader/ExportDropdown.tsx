import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './ExportDropdown.scss'

function ExportDropdown() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }
  const handleExport = (format) => {
    const toastId = toast.info(`Exporting as ${format.toUpperCase()}...`)
    // simulate export fail
    setTimeout(() => {
      toast.update(toastId, {
        autoClose: 3000,
        render: `${format.toUpperCase()} export failed!`,
        type: 'error',
      })
    }, 2000)

    //simulate export success
    setTimeout(() => {
      toast.update(toastId, {
        autoClose: 3000,
        render: `${format.toUpperCase()} export completed!`,
        type: toast.TYPE.SUCCESS,
      })
    }, 2000)
  }

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown} type="button">
        Export
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <a
            href="#"
            onClick={() => {
              handleExport('csv')
              toggleDropdown()
            }}
          >
            CSV
          </a>
          <a
            href="#"
            onClick={() => {
              handleExport('json')
              toggleDropdown()
            }}
          >
            JSON
          </a>
        </div>
      )}
    </div>
  )
}

export default ExportDropdown
