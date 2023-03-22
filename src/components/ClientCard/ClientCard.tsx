import React, { useState } from 'react'
import { Property } from '@/types/common';
import { ChevronUp, ChevronDown, PencilIcon } from '../Icons/Icons';
import styles from './ClientCard.module.scss'
import { formatAddress } from '@/utils';

interface ClientCardProps {
  handleCardClick: (e: React.SyntheticEvent, propId: string) => void;
  clientProperties: any;
  clientName: string;
  clientId: string;
}

const ClientCard:React.FC<ClientCardProps> = ({
  handleCardClick,
  clientProperties: cProps,
  clientId, 
  clientName
}) => {

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  
  return (
    <>
      { cProps && cProps.length > 0 &&
        <div className={`flex-y ${styles['client-card-wrapper']}`}>
          <header className='flex-x'>
            <h4>{clientId} | {clientName} </h4>
            
            <div onClick={() => setIsExpanded(!isExpanded)}>
              <span className='italicized-record-count'>(Properties: {cProps.length})</span>
              { isExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </header>

          <div className={`${isExpanded ? styles.expanded : ''} ${styles['dropdown-content']}`}>
              { cProps.map((prop:Property) => {          

                  const address = formatAddress({
                    street: prop.PSTRET,
                    condo: prop.PCONDO,
                    unit: prop.PUNIT,
                    lot: prop.PLOT
                  })

                  return (
                      <div
                        key={prop.id}
                        onClick={(e) => handleCardClick(e, prop.id)} 
                        className={`flex-x ${styles['client-card-info']}`}
                      >
                        <section className='flex-y f-100'>
                          <span><b>Address:&nbsp;</b>{address}</span>
                          <span><b>City:&nbsp;</b>{prop.PCITY}</span>
                          <span><b>Instructions:&nbsp;</b>{prop.PINSTR}</span>
                        </section>
                        <section className='flex-y f-50'>
                          <span><b>CompRef:&nbsp;</b>{prop.PCOMPREF}</span>
                          <span><b>Type:&nbsp;</b>{prop.PTYPE}</span>
                          <span><b>Status:&nbsp;</b>{prop.PSTAT}</span>
                        </section>
                        <span title={`Edit ${address}`}>
                          <PencilIcon />
                        </span>
                      </div> 
                  )
                })
              }
          </div>      
        </div>
      }
    </>
  )
}

export default ClientCard