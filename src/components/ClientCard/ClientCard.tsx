import React, { Dispatch, SetStateAction, useState } from 'react'
import { Property } from '@/types/common';
import { ChevronUp, ChevronDown, PencilIcon } from '../Icons/Icons';
import styles from './ClientCard.module.scss'
import { formatAddress } from '@/utils';

interface ClientCardProps {
  handleCardClick: (e: React.SyntheticEvent, id: string) => void;
  clientProperties: any;
  propertyStreet: string;
  setLabelsToPrint: Dispatch<SetStateAction<Property[]>>;
}

const ClientCard:React.FC<ClientCardProps> = ({
  handleCardClick,
  clientProperties: cProps,
  propertyStreet, 
  setLabelsToPrint
}) => {

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  
  return (
    <>
      { cProps && cProps.length > 0 &&
        <div className={`flex-y ${styles['client-card-wrapper']}`}>
          <header className='flex-x'>
            <h4>{propertyStreet}</h4>
            
            <div onClick={() => setIsExpanded(!isExpanded)}>
              <span className='italicized-record-count'>(Properties: {cProps.length})</span>
              { isExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </header>

          <div className={`${isExpanded ? styles.expanded : ''} ${styles['dropdown-content']}`}>
              { cProps.map((property:Property) => {          

                  const address = formatAddress({
                    street: property.p_street,
                    condo: property.p_condo,
                    unit: property.p_unit,
                    lot: property.p_lot
                  })

                  return (
                    <div 
                      key={property.id}
                      className={styles['info-and-checkbox-container']}
                    >
                      <div
                        onClick={(e) => handleCardClick(e, property.id)} 
                        className={`flex-x ${styles['client-card-info']}`}
                      >
                        <section className='flex-y f-100'>
                          <span><b>Address:&nbsp;</b>{address}</span>
                          <span><b>City:&nbsp;</b>{property.p_city}</span>
                          <span><b>Instructions:&nbsp;</b>{property.p_instructions}</span>
                        </section>
                        <section className='flex-y f-50'>
                          <span><b>CompRef:&nbsp;</b>{property.p_comp_ref || 'N/A'}</span>
                          <span><b>File#:&nbsp;</b>{property.p_file || 'N/A'}</span>
                          <span><b>Type:&nbsp;</b>{property.p_type || 'N/A'}</span>
                          <span><b>Status:&nbsp;</b>{property.p_status || 'N/A'}</span>
                        </section>
                        <span title={`Edit ${address}`}>
                          <PencilIcon />
                        </span>
                      </div> 
                      <span className={styles['print-checkbox-group']}>
                        <label htmlFor="print">Print?</label>
                        <input 
                          id={property.id} 
                          name={`print-${property.id}`} 
                          type='checkbox'
                          onClick={(e) => {
                            const ischecked = (e.target as HTMLInputElement).checked
                            const propertyId = (e.target as HTMLInputElement).id
                      
                            if(ischecked) {
                              setLabelsToPrint((prevState) => {
                                const updatedArray = [...prevState, property]
                                return updatedArray
                              })
                            } else {
                              setLabelsToPrint((prevState) => {
                                const filteredArray = prevState.filter(currentProperty => (
                                  currentProperty.id !== propertyId
                                ))
                                return filteredArray
                              })
                            }
                          }}
                        />
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