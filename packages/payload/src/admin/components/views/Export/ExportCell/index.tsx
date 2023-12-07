import React, { useState } from 'react'
import './index.scss'
import { setISODay } from 'date-fns'

const ExportCell = (props) => {
  const { name, color, onMainSelection, selection, enables } = props
  const [isOpen, setIsOpen] = useState(false)

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
                      className="version-checkbox"
                      type="checkbox"
                      checked={selection[1]}
                      onChange={() => handleVersionsButton()}
                    />
                  ) : (
                    <input className="disabled-checkbox" type="checkbox" disabled />
                  )}
                  Production:
                  {enables[1] ? (
                    <input
                      className="production-checkbox"
                      type="checkbox"
                      checked={selection[2]}
                      onChange={() => handleProductionButton()}
                    />
                  ) : (
                    <input className="disabled-checkbox" type="checkbox" disabled />
                  )}
                  Drafts:
                  {enables[2] ? (
                    <input
                      className="development-checkbox"
                      type="checkbox"
                      checked={selection[3]}
                      onChange={() => handleDraftsButton()}
                    />
                  ) : (
                    <input className="disabled-checkbox" type="checkbox" disabled />
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
