import React, { useEffect, useState } from 'react'
import './index.scss'
import ExportSearchWrapper from '../ExportSearchWrapper/index'

const ExportList = (props) => {
  const { collectionsDict } = props
  let collectionNames = Object.keys(collectionsDict)

  return (
    <div className="export-list-container">
      <div className="header">
        <h2>Export Function</h2>
      </div>
      <ul>
        <ExportSearchWrapper collectionsDict={collectionsDict}></ExportSearchWrapper>
      </ul>
    </div>
  )
}

export default ExportList
