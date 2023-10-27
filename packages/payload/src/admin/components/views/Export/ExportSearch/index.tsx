import { plural } from 'pluralize'
import React, { useEffect, useState } from 'react'

const ExportSearch = ({ collections }) => {
  //set default state
  const allSearch = collections.map((item) => item.labels.plural)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(allSearch)

  const handleSearch = (searchStr) => {
    //process search string
    setSearchQuery(searchStr)
    const searchTerm = searchStr.trim().toLowerCase()
    if (searchStr == '') {
      setSearchResults(allSearch)
    } else {
      const filteredResults = collections
        .filter(
          (item) =>
            item.labels &&
            item.labels.plural &&
            item.labels.plural.toLowerCase().startsWith(searchTerm),
        )
        .map((item) => item.labels.plural)

      setSearchResults(filteredResults)
    }
  }
  return (
    <div>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Title"
        type="text"
        value={searchQuery}
      />

      <div>
        {searchResults.length > 0 ? (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>{result}</li>
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

export default ExportSearch
