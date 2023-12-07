import { setISODay } from 'date-fns'
import React, { useState } from 'react'

import './index.scss'

const ExportCell = (props) => {
  const { name, color, enables, onMainSelection, selection } = props
  const [isOpen, setIsOpen] = useState(false)
  console.log(name, enables)

  const handleMainButton = () => {
    onMainSelection(name, 0)
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleVersionsButton = () => {
    onMainSelection(name, 1)
  }

  const handleProductionButton = () => {
    onMainSelection(name, 2)
  }

  const handleDraftsButton = () => {
    onMainSelection(name, 3)
  }

  return (
    <div className="cell-container">
      <div className="mainContainer">
        <div className={`exportCell ${color}`}>
          <div className="collection-cell">
            <div className="checkbox-cell">
              <input
                checked={selection[0]}
                className="collection-checkbox"
                onChange={() => handleMainButton()}
                type="checkbox"
              />
            </div>
            <div className={`dropdown-cell ${isOpen ? 'open' : ''}`}>
              <div className="collection-name-container">
                <span className="collection-name">{name}</span>
                <span>&nbsp;</span>
              </div>
              <div className="total-version-count" />

              {isOpen && (
                <div>
                  Versions:
                  {enables[0] ? (
                    <input
                      checked={selection[1]}
                      className="version-checkbox"
                      onChange={() => handleVersionsButton()}
                      type="checkbox"
                    />
                  ) : (
                    <input className="disabled-checkbox" disabled type="checkbox" />
                  )}
                  Published:
                  {enables[1] ? (
                    <input
                      checked={selection[2]}
                      className="production-checkbox"
                      onChange={() => handleProductionButton()}
                      type="checkbox"
                    />
                  ) : (
                    <input className="disabled-checkbox" disabled type="checkbox" />
                  )}
                  Drafts:
                  {enables[1] ? (
                    <input
                      checked={selection[3]}
                      className="development-checkbox"
                      onChange={() => handleDraftsButton()}
                      type="checkbox"
                    />
                  ) : (
                    <input className="disabled-checkbox" disabled type="checkbox" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportCell
