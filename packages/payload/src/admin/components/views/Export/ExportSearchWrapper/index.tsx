import React, { useEffect, useState } from 'react'

import ExportButton from '../ExportButton/index'
import ExportCell from '../ExportCell/index'
import './index.scss'
import { select } from '../../../../../fields/validations'

const ExportSearchWrapper = (props) => {
  const alternatingColorClasses = ['even-color', 'odd-color']

  const { collectionsDict } = props
  const allSearch = Object.keys(collectionsDict)

  const [searchQuery, setSearchQuery] = useState('')

  const [searchResults, setSearchResults] = useState(allSearch)
  const [sortOrder, setSortOrder] = useState('default')

  const [displayList, setDisplayList] = useState(allSearch)

  const slugDictionary = {}
  allSearch.forEach((value) => {
    slugDictionary[value] = [false, false, false, false]
  })
  const [selectedVersions, setSelectedVersions] = useState(slugDictionary)

  console.log(selectedVersions)

  const refreshList = () => {
    const sortedResults = applySort(searchResults)
    setDisplayList(sortedResults)
  }

  const applySort = (items) => {
    const sortedItems = [...items]
    if (sortOrder === 'asc' || sortOrder === 'desc') {
      return sortedItems.sort((a, b) => {
        const nameA = a.toLowerCase()
        const nameB = b.toLowerCase()
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      })
    } else {
      return sortedItems
    }
  }

  useEffect(() => {
    refreshList()
  }, [searchResults, sortOrder])

  const handleCollectionChange = (name, index) => {
    setSelectedVersions((selectedVersions) => {
      const updatedVersions = { ...selectedVersions }
      updatedVersions[name][index] = !updatedVersions[name][index]
      return updatedVersions
    })
  }

  const handleSearch = (searchStr) => {
    setSearchQuery(searchStr)
    const searchTerm = searchStr.trim().toLowerCase()
    if (searchStr === '') {
      setSearchResults(allSearch)
    } else {
      const filteredResults = allSearch
        .filter((item) => item && item.toLowerCase().startsWith(searchTerm))
        .map((item) => item)

      setSearchResults(filteredResults)
    }
  }

  const handleSort = () => {
    const orderOptions = ['asc', 'desc', 'default']
    const currentIndex = orderOptions.indexOf(sortOrder)
    const nextIndex = (currentIndex + 1) % orderOptions.length
    const newSortOrder = orderOptions[nextIndex]
    setSortOrder(newSortOrder)
  }

  return (
    <div className="mainContainer">
      <div className="inputContainer">
        <div className="iconContainer" />
        <input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Collection Name"
          type="text"
          value={searchQuery}
        />
        <button className="sortButton" onClick={handleSort}>
          {sortOrder === 'asc'
            ? 'Sort By: Ascending'
            : sortOrder === 'desc'
            ? 'Sort By: Descending'
            : 'Sort By: Default Order'}
        </button>
      </div>

      <div className="alertcontainer">
        <div className="buttonsContainer">
          <ExportButton selectedVersions={selectedVersions} />
        </div>
      </div>

      <div>
        {displayList.length > 0 ? (
          <div className="listContainer">
            <ul>
              {displayList.map((name, index) => (
                <ExportCell
                  color={alternatingColorClasses[index % alternatingColorClasses.length]}
                  key={collectionsDict[name].slug}
                  name={name}
                  onMainSelection={handleCollectionChange}
                  // onSelectionChange={handleVersionChange}
                  selection={selectedVersions[name]}
                  enables={collectionsDict[name]}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p>No results found. Please change Search Query, or Show Filter.</p>
        )}
      </div>
    </div>
  )
}

export default ExportSearchWrapper
