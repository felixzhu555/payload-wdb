import React, { useState } from 'react'

import './ExportDropdown.scss'

function ExportDropdown() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown} type="button">
        Export
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <a href="#" onClick={toggleDropdown}>
            CSV
          </a>
          <a href="#" onClick={toggleDropdown}>
            JSON
          </a>
        </div>
      )}
    </div>
  )
}

export default ExportDropdown
