import React, { useState } from 'react'

import './index.scss'

function ExportButton() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown} type="button">
        Download
      </button>
    </div>
  )
}

export default ExportButton
