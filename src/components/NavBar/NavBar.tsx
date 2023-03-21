import React from 'react'
import NavBarFacet from '../NavBarFacet/NavBarFacet'
import links, { LinkType } from './links'
import styles from './NavBar.module.scss'

const NavBar = () => {
  return (
    <div className={styles['nav-bar-wrapper']}>
      <span className={styles.title}>Rainen Law</span>
      { Object.keys(links).map(key => (
          <NavBarFacet 
            key={key}
            name={key} 
            links={links[key as LinkType]} 
          />
        ))
      }
    </div>
  )
}

export default NavBar