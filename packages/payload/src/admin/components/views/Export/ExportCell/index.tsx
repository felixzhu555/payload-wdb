import React, { useState } from 'react'
import './index.scss'

const ExportCell = (props) => {
  const { name, slug, versions } = props
  const [isOpen, setIsOpen] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])

  const toggleCollection = () => {
    setIsSelected(!isSelected)
    if (!isSelected) {
      const versionsWithName = versions.map((element) => slug + ' ' + element)
      setSelectedVersions(versionsWithName)
    } else {
      setSelectedVersions([])
    }
  }

  const toggleVersion = (version) => {
    const versionWithName = slug + ' ' + version
    const newSelectedVersions = selectedVersions.includes(versionWithName)
      ? selectedVersions.filter((v) => v !== versionWithName)
      : [...selectedVersions, versionWithName]
    setSelectedVersions(newSelectedVersions)
  }

  return (
    <div>
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
                checked={selectedVersions.includes(slug + ' ' + version)}
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
