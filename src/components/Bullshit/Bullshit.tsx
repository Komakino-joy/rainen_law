import React from 'react'
import NavBarFacet from '../NavBarFacet/NavBarFacet'
import styles from './Navbar.module.scss'

const Bullshit = () => {
  return (
    <div className={styles['nav-bar-wrapper']}>
      <span className={styles.title}>Rainen Law</span>
      <NavBarFacet />
    </div>
  )
}

export default Bullshit