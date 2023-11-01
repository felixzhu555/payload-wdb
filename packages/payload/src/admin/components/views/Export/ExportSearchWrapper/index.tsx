import { basename } from 'path'
import React, { useState, useEffect } from 'react'
import ExportCell from '../ExportCell/index'
import './index.scss'

const ExportSearchWrapper = (props) => {
  const { collectionsDict } = props
  const allSearch = Object.keys(collectionsDict)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(allSearch)

  const [selectedVersions, setSelectedVersions] = useState({})

  console.log(selectedVersions)
  const handleVersionChange = (dictionary) => {
    setSelectedVersions((prevSelectedVersions) => {
      return {
        ...prevSelectedVersions,
        ...dictionary,
      }
    })
    setSelectedVersions((prevSelectedVersions) => {
      // Use the `reduce` method to filter out keys with non-empty arrays
      const updatedVersions = Object.keys(prevSelectedVersions).reduce((acc, key) => {
        if (prevSelectedVersions[key].length > 0) {
          acc[key] = prevSelectedVersions[key]
        }
        return acc
      }, {})

      return updatedVersions
    })
  }

  const handleSearch = (searchStr) => {
    setSearchQuery(searchStr)
    const searchTerm = searchStr.trim().toLowerCase()
    if (searchStr === '') {
      // If the search query is empty, show the entire collection
      setSearchResults(allSearch)
    } else {
      const filteredResults = allSearch
        .filter((item) => item && item.toLowerCase().startsWith(searchTerm))
        .map((item) => item)

      setSearchResults(filteredResults)
    }
  }

  return (
    <div>
      <div className="inputContainer">
        <input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Title"
          type="text"
          value={searchQuery}
        />
      </div>

      <div>
        {searchResults.length > 0 ? (
          <div>
            <ul>
              {searchResults.map((name, index) => (
                <ExportCell
                  name={name}
                  slug={collectionsDict[name].slug}
                  versions={collectionsDict[name].versions} // Use "versions" instead of "version"
                  key={index} // Add a unique key for each element in the map
                  onSelectionChange={handleVersionChange}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  )
}

export default ExportSearchWrapper
