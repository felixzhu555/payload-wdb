import React, { useState } from 'react'
import './index.scss'

const ExportCell = (props) => {
  const { name, color, onCollectionChange, selection, versions } = props
  const [isOpen, setIsOpen] = useState(false)

  const totalVersionCount = versions.length

  const hypo1 = [true, false, false]
  const hypo2 = [false, true, true]
  const hypo3 = [true, true, true]

  const hypo = hypo2

  return (
    <div className="cell-container">
      <div className="mainContainer">
        <div className={`exportCell ${color}`}>
          <div className="collection-cell">
            <div className="checkbox-cell">
              <input
                checked={selection && selection.length > 0}
                className="collection-checkbox"
                onChange={() => onCollectionChange(name, versions)}
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

              <div>
                {hypo[0] ? (
                  <input className="version-checkbox" type="checkbox" />
                ) : (
                  <input className="disabled-checkbox" type="checkbox" disabled />
                )}

                {hypo[1] ? (
                  <input className="production-checkbox" type="checkbox" />
                ) : (
                  <input className="disabled-checkbox" type="checkbox" disabled />
                )}

                {hypo[2] ? (
                  <input className="development-checkbox" type="checkbox" />
                ) : (
                  <input className="disabled-checkbox" type="checkbox" disabled />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportCell
