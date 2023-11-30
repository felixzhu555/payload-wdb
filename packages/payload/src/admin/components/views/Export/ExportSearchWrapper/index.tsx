import React, { useEffect, useState } from 'react'

import ExportButton from '../ExportButton/index'
import ExportCell from '../ExportCell/index'
import './index.scss'

const ExportSearchWrapper = (props) => {
  const alternatingColorClasses = ['even-color', 'odd-color']

  const { collectionsDict } = props
  const allSearch = Object.keys(collectionsDict)

  const [searchQuery, setSearchQuery] = useState('')

  const [searchResults, setSearchResults] = useState(allSearch)
  const [sortOrder, setSortOrder] = useState('default')

  const [displayList, setDisplayList] = useState(allSearch)
  const [selectAll, setSelectAll] = useState(false)

  const slugDictionary = {}
  allSearch.forEach((slug) => {
    slugDictionary[slug] = []
  })
  const [selectedVersions, setSelectedVersions] = useState(slugDictionary)

  const refreshList = () => {
    if (showAll) {
      const sortedResults = applySort(searchResults)
      setDisplayList(sortedResults)
    } else if (showSelected) {
      const selectedItems = searchResults.filter((name) => selectedVersions[name].length > 0)
      const sortedResults = applySort(selectedItems)
      setDisplayList(sortedResults)
    } else if (showUnselected) {
      const unselectedItems = searchResults.filter((name) => selectedVersions[name].length === 0)
      const sortedResults = applySort(unselectedItems)
      setDisplayList(sortedResults)
    }
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

  // This section is no longer being used
  const [showAll, setShowAll] = useState(true)
  const [showSelected, setShowSelected] = useState(false)
  const [showUnselected, setShowUnselected] = useState(false)

  const handleShowAll = () => {
    if (showAll == true) {
      refreshList()
    } else {
      setShowAll(true)
      setShowSelected(false)
      setShowUnselected(false)
    }
  }

  const handleShowSelected = () => {
    if (showSelected) {
      refreshList()
    } else {
      setShowAll(false)
      setShowSelected(true)
      setShowUnselected(false)
    }
  }

  const handleShowUnselected = () => {
    if (showUnselected) {
      refreshList()
    } else {
      setShowAll(false)
      setShowSelected(false)
      setShowUnselected(true)
    }
  }

  useEffect(() => {
    refreshList()
  }, [searchResults, sortOrder, showAll, showSelected, showUnselected])

  const handleVersionChange = (name, version) => {
    setSelectedVersions((prevSelectedVersions) => {
      const updatedVersions = { ...prevSelectedVersions }
      if (!updatedVersions[name]) {
        updatedVersions[name] = []
      }
      const versionIndex = updatedVersions[name].indexOf(version)

      if (versionIndex !== -1) {
        updatedVersions[name].splice(versionIndex, 1)
      } else {
        updatedVersions[name].push(version)
      }

      return updatedVersions
    })
  }

  const handleCollectionChange = (name, versions) => {
    setSelectedVersions((prevSelectedVersions) => {
      const updatedVersions = { ...prevSelectedVersions }

      if (!updatedVersions[name]) {
        updatedVersions[name] = []
      }

      const isCollectionEmpty = updatedVersions[name].length === 0

      if (isCollectionEmpty) {
        updatedVersions[name] = [...versions]
      } else {
        updatedVersions[name] = []
      }

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

  const getTotalSelectedVersionsCount = () => {
    let totalCount = 0
    for (const slug in selectedVersions) {
      if (Object.hasOwnProperty.call(selectedVersions, slug)) {
        totalCount += selectedVersions[slug].length
      }
    }
    return totalCount
  }

  const getTotalVersionsLength = () => {
    let totalLength = 0

    for (const collectionName in collectionsDict) {
      if (Object.hasOwnProperty.call(collectionsDict, collectionName)) {
        const versions = collectionsDict[collectionName].versions
        totalLength += versions.length
      }
    }

    return totalLength
  }

  const handleShowAlert = () => {
    const nonEmptyVersions = Object.fromEntries(
      Object.entries(selectedVersions).filter(([slug, versions]) => versions.length > 0),
    )
    let alertContent = 'Collection with versions selected:\n'
    for (const slug in nonEmptyVersions) {
      if (Object.hasOwnProperty.call(nonEmptyVersions, slug)) {
        alertContent += `${slug}: ${nonEmptyVersions[slug].join(', ')}\n`
      }
    }
    if (alertContent !== '') {
      alert(alertContent)
    } else {
      alert('No versions selected.')
    }
  }

  const handleSelectAll = () => {
    const updatedSelectedVersions = { ...selectedVersions }

    searchResults.forEach((name) => {
      const slug = name
      const allVersions = collectionsDict[name].versions
      updatedSelectedVersions[slug] = [...allVersions]
    })
    setSelectedVersions(updatedSelectedVersions)
  }

  const handleDeselectAll = () => {
    const updatedSelectedVersions = { ...selectedVersions }

    searchResults.forEach((name) => {
      const slug = name
      updatedSelectedVersions[slug] = []
    })
    setSelectedVersions(updatedSelectedVersions)
  }

  const handleCheckboxChange = () => {
    setSelectAll(!selectAll)
    const updatedSelectedVersions = {}

    searchResults.forEach((name) => {
      const slug = name
      const allVersions = collectionsDict[name].versions
      updatedSelectedVersions[slug] = selectAll ? [] : [...allVersions]
    })

    setSelectedVersions(updatedSelectedVersions)
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
        {/* <div className="show-div">
          <button className={`showAllButton ${showAll ? 'selected' : ''}`} onClick={handleShowAll}>
            Show All
          </button>

          <button
            className={`showSelectedButton ${showSelected ? 'selected' : ''}`}
            onClick={handleShowSelected}
          >
            Show Selected Collections
          </button>

          <button
            className={`showUnselectedButton ${showUnselected ? 'selected' : ''}`}
            onClick={handleShowUnselected}
          >
            Show Unselected Collections
          </button>
        </div> */}
        <button className="sortButton" onClick={handleSort}>
          {sortOrder === 'asc'
            ? 'Sort By: Ascending'
            : sortOrder === 'desc'
            ? 'Sort By: Descending'
            : 'Sort By: Default Order'}
        </button>
      </div>

      <div className="alertcontainer">
        <input
          checked={selectAll}
          className={`selectAllCheckbox ${
            getTotalSelectedVersionsCount() === getTotalVersionsLength() ? 'selectSelected' : ''
          }`}
          onChange={handleCheckboxChange}
          type="checkbox"
        />
        <div className="selectedVersionsCount">
          Total Selected Versions: {getTotalSelectedVersionsCount()}
        </div>

        <div className="buttonsContainer">
          {/* <button
            className={`deselectAllButton ${
              getTotalSelectedVersionsCount() === 0 ? 'selectSelected' : ''
            }`}
            onClick={handleDeselectAll}
          >
            Deselect All
          </button>

          <button
            className={`selectAllButton ${
              getTotalSelectedVersionsCount() === getTotalVersionsLength() ? 'selectSelected' : ''
            }`}
            onClick={handleSelectAll}
          >
            Select All
          </button>

          <button onClick={handleShowAlert}> Selected Versions </button> */}

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
                  onCollectionChange={handleCollectionChange}
                  onSelectionChange={handleVersionChange}
                  selection={selectedVersions[name]}
                  versions={collectionsDict[name].versions}
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
