import { PTYPE_MAP } from '@/constants'
import React from 'react'
import styles from './TitlesBreakDown.module.scss'

const TitlesBreakDown = ({titleTypeMap, totalRecords}: {titleTypeMap: {}, totalRecords:number}) => {
  return (
    <div className={`light-border ${styles['titles-breakdown-container']}`}>
      { Object.keys(titleTypeMap).map(key => (
          <div key={key} className={styles['title-detail']}>
            <span>{PTYPE_MAP[key as keyof typeof PTYPE_MAP] || key}:&nbsp;</span>
            <span>{titleTypeMap[key as keyof typeof titleTypeMap]}</span>
            <span>{((titleTypeMap[key as keyof typeof titleTypeMap] / totalRecords) * 100).toFixed(2)}%</span>
          </div>
        ))
      }
      <div className={styles['column-footer']}>
        <span>Total:&nbsp;</span>
        <span>{totalRecords}</span>
        <span>100%</span>
      </div>
    </div>
  )
}

export default TitlesBreakDown