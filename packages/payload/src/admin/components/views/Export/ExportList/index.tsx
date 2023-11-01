import React, { useEffect, useState } from 'react'

import ExportHeader from '../ExportHeader/index'
import ExportSearchWrapper from '../ExportSearchWrapper/index'
import './index.scss'

const ExportList = (props) => {
  const { collectionsDict } = props
  const collectionNames = Object.keys(collectionsDict)

  return (
    <div className="export-list-container">
      <ExportHeader />
      <ul>
        <ExportSearchWrapper collectionsDict={collectionsDict} />
      </ul>
    </div>
  )
}

export default ExportList
