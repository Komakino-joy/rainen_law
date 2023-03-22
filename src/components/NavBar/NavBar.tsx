import Link from 'next/link'
import React from 'react'
import NavBarFacet from '../NavBarFacet/NavBarFacet'
import links, { LinkType } from './links'
import styles from './NavBar.module.scss'

const NavBar = () => {
  return (
    <div className={styles['nav-bar-wrapper']}>
      <Link 
        href={'/'}
        className={styles.title} 
      >
        Rainen Law
      </Link>
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