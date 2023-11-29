import React, { useEffect, useState } from 'react'

import ExportDropdown from './ExportDropdown'
import './index.scss'

const ExportHeader = () => {
  return (
    <React.Fragment>
      <div className="header">
        <div className="title">Export</div>
        <ExportDropdown />
      </div>
    </React.Fragment>
  )
}

export default ExportHeader
