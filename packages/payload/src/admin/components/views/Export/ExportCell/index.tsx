import React, { useState } from 'react'

import { select } from '../../../../../fields/validations'
import './index.scss'

// ... (imports and other code)

const ExportCell = (props) => {
  const { name, color, onCollectionChange, onSelectionChange, selection, versions } = props
  const [isOpen, setIsOpen] = useState(false)

  const totalVersionCount = versions.length

  return (
    <div className="cell-container">
      <div className="mainContainer">
        <div className={`exportCell ${color}`}>
          <div className="collection-cell">
            <div className="checkbox-cell">
              <input
                checked={selection && selection.length > 0}
                className="collection-checkbox"
                onChange={() => onCollectionChange(name, versions)} // Handle collection checkbox change
                type="checkbox"
              />
            </div>
            <div
              className={`dropdown-cell ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="collection-name-container">
                <span className="collection-name">{name}</span>
                <span>&nbsp;</span>
                <span>{'(' + totalVersionCount + ')'}</span>
              </div>
              <div className="total-version-count" />
              <div className="arrow-container">
                <span className={`arrow ${isOpen ? 'up' : 'down'}`} />
              </div>
            </div>
          </div>
        </div>
        {isOpen &&
          versions.map((version) => (
            <div className={`version-cell ${color}`} key={version}>
              <div className="checkbox-cell">
                <input
                  checked={selection.includes(version)}
                  className="collection-checkbox"
                  onChange={() => onSelectionChange(name, version)} // Handle version checkbox change
                  type="checkbox"
                />
              </div>
              <div className="dropdown-cell">
                <span className="collection-version">{'Version ' + version}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ExportCell
