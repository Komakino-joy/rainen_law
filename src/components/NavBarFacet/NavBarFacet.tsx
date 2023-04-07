import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronDown } from '../Icons/Icons'
import styles from './NavBarFacet.module.scss'

interface NavBarFacetProps {
  name: string;
  links?: {
    href: string;
    ctaText: string;
  }[];
}

const NavBarFacet:React.FC<NavBarFacetProps> = ({
  name,
  links
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const router = useRouter()

  return (
    <div className={styles['nav-bar-facet']}>
      <span 
        className={styles['nav-bar-facet-header']}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span className={router.pathname.split('/')[1] === name ? styles['selected'] : ''}>
          {name}
        </span>
        {links ? <ChevronDown /> : null}
      </span>
      { links ?
          <div 
            className={`${ isExpanded ? styles['expanded'] : styles['hidden']}`} 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
              <div className={styles['nav-bar-facet-dropdown']}>
                { links.map(link => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      onClick={() => setIsExpanded(false)}
                    >
                      {link.ctaText}
                    </Link>
                  ))
                }
              </div>
          </div>
        :null
        }
    </div>
  )
}

export default NavBarFacet