import React, { useState } from 'react'
import { select } from '../../../../../fields/validations'
import './index.scss'

const ExportCell = (props) => {
  const { name, slug, versions, onSelectionChange } = props
  const [isOpen, setIsOpen] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState({ [slug]: [] })

  const toggleCollection = () => {
    setIsSelected(!isSelected)
    setSelectedVersions((prevSelectedVersions) => {
      const updatedVersions = prevSelectedVersions
      if (!isSelected) {
        updatedVersions[slug] = versions
      } else {
        updatedVersions[slug] = []
      }
      onSelectionChange(updatedVersions)
      return updatedVersions
    })
    // This line should be outside of setSelectedVersions
  }

  const toggleVersion = (version) => {
    setSelectedVersions((prevSelectedVersions) => {
      const updatedVersions = prevSelectedVersions
      if (updatedVersions[slug].includes(version)) {
        updatedVersions[slug] = updatedVersions[slug].filter((v) => v !== version)
      } else {
        updatedVersions[slug].push(version)
      }
      onSelectionChange(updatedVersions)
      if (Object.keys(updatedVersions[slug]).length === 0) {
        setIsSelected(false)
      } else {
        setIsSelected(true)
      }
      return updatedVersions
    })
  }

  return (
    <div className="exportCell">
      <div className="collection-cell">
        <div className="checkbox-cell">
          <input
            checked={isSelected}
            className="collection-checkbox"
            onChange={toggleCollection} // Handle collection checkbox change
            type="checkbox"
          />
        </div>
        <div className="dropdown-cell" onClick={() => setIsOpen(!isOpen)}>
          <span className="collection-name">{name}</span>
        </div>
      </div>
      {isOpen &&
        versions.map((version) => (
          <div className="version-cell" key={version}>
            <div className="checkbox-cell">
              <input
                checked={selectedVersions[slug].includes(version)}
                className="collection-checkbox"
                onChange={() => toggleVersion(version)} // Handle version checkbox change
                type="checkbox"
              />
            </div>
            <div className="dropdown-cell">
              <span className="collection-version">{version}</span>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ExportCell
