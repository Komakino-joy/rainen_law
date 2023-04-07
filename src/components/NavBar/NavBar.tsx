import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NavBarFacet from '../NavBarFacet/NavBarFacet'
import links, { LinkType } from './links'
import styles from './NavBar.module.scss'
import { useAuth } from '@/context/AuthContext'

const NavBar = () => {
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <div className={styles['nav-bar-wrapper']}>
      <Link 
        href={'/'}
        className={styles.title} 
      >
        Rainen Law
      </Link>
      <Link 
        href={'/'}
        className={`${styles.home} ${router.pathname === '/' ? styles.selected : ''}`} 
      >
        Home
      </Link>
      { Object.keys(links).map(key => (
          <NavBarFacet 
            key={key}
            name={key} 
            links={links[key as LinkType]} 
          />
        ))
      }
      <span 
        className={styles['sign-out-button']}
        onClick={() => logout()}
      >
        Sign out
      </span>
    </div>
  )
}

export default NavBar