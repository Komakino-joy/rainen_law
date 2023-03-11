import React, { useState } from 'react'
import { ChevronDown } from '../Icons/Icons'
import styles from './NavBarFacet.module.scss'

const NavBarFacet = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <div className={styles['nav-bar-facet']}>
      <span 
        className={styles['nav-bar-facet-header']}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span>Hello</span>
        <ChevronDown />
      </span>
      <div 
        className={`${ isExpanded ? styles['expanded'] : styles['hidden']}`} 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={styles['nav-bar-facet-dropdown']}>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
          <span>Links</span>
        </div>
      </div>
    </div>
  )
}

export default NavBarFacet