import React, { useState } from 'react'
import { Property } from '@/types/common';
import { ChevronUp, ChevronDown } from '../Icons/Icons';
import './ClientCard.scss'
import '../../styles/globals.scss'

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
        <div id='client-card-wrapper' className='flex-y'>
          <header className='flex-x'>
            <h4>{clientId} | {clientName} </h4>
            
            <div onClick={() => setIsExpanded(!isExpanded)}>
              <span className='italicized-record-count'>(Properties: {cProps.length})</span>
              { isExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </header>

          <div className={`${isExpanded ? 'expanded' : ''} dropdown-content`}>
              { cProps.map((prop:Property) => {          
                  const address = [
                    prop.PSTRET,
                  ]

                  if(prop.PCONDO) address.push(`${prop.PCONDO}`) 
                  if(prop.PUNIT) address.push(`Unit ${prop.PUNIT}`) 
                  if(prop.PLOT) address.push(`Lot ${prop.PLOT}`) 
                  
                  return (
                      <div
                        key={prop.PROPID}
                        onClick={(e) => handleCardClick(e, prop.PROPID)} 
                        className={`flex-x client-card-info`}
                      >
                        <section className='flex-y f-100'>
                          <span><b>Address:&nbsp;</b>{address.join(', ')}</span>
                          <span><b>City:&nbsp;</b>{prop.PCITY}</span>
                          <span><b>Instructions:&nbsp;</b>{prop.PINSTR}</span>
                        </section>
                        <section className='flex-y f-50'>
                          <span><b>CompRef:&nbsp;</b>{prop.PCOMPREF}</span>
                          <span><b>Type:&nbsp;</b>{prop.PTYPE}</span>
                          <span><b>Status:&nbsp;</b>{prop.PSTAT}</span>
                        </section>
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