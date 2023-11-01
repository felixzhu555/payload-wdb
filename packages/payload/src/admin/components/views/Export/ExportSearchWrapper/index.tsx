import { basename } from 'path'
import React, { useEffect, useState } from 'react'

import ExportCell from '../ExportCell/index'
import './index.scss'

const WhiteSearchIcon = () => (
  <svg
    className="search-icon"
    fill="none"
    height="18"
    stroke="white" // Set the stroke color to white
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
)

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
        <WhiteSearchIcon />
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
                  key={index} // Add a unique key for each element in the map
                  name={name}
                  slug={collectionsDict[name].slug}
                  versions={collectionsDict[name].versions} // Use "versions" instead of "version"
                  key={index} // Add a unique key for each element in the map
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
