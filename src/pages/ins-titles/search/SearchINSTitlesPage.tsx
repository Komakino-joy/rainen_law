'use client';

import React, { useState } from 'react'
import axios from 'axios';
import Modal from '@/components/Modal/Modal';
import ClientCard from '@/components/ClientCard/ClientCard';
import PropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import InfoCard from '@/components/InfoCard/InfoCard';
import INSSearchForm from '@/components/Forms/INSSearchForm/INSSearchForm';
import { useINSTitlesContext } from '@/context/INSTitles';
import Spinner from '@/components/Spinner/Spinner';

const SearchINSTitlesPage = () => {
  const {isLoadingINSTitlescontext} = useINSTitlesContext()
  const isLoading = isLoadingINSTitlescontext

  const [showModal, setShowModal] = useState(false);
  const [clientProperties, setClientProperties] = useState(null)
  const [selectedInsTitleId, setSelectedInsTitleId] = useState<string|null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)

  const handleCardClick =(e: React.SyntheticEvent, insTitleId: string) => {
    e.preventDefault()
    setSelectedInsTitleId(insTitleId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedInsTitleId(null)
    setShowModal(false)
  }

  const onSubmit = async (data:any) => {
    console.log(data)
    if(Object.keys(data).every(key => data[key] === '' || data[key] === undefined || data[key] === null)) {
      alert('No search parameters were provided.')
    } else {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/post-search-ins-title`, data)
      // if(response.data.rows.length === 0) {
      //   setNoResults(true)
      //   setClientProperties(null)
      //   return 
      // }
      
      // setNoResults(false)

      // const groupedByCustomer = response.data.rows.reduce((acc: any, property: Property) => {
      //   type propKeyT = keyof typeof property
      //   if (!acc[property.CNAME as propKeyT]) {
      //     acc[property.CNAME as propKeyT] = []
      //   } 
      //   acc[property.CNAME as keyof typeof property].push(property)
      //   return acc
      // },{})

      // setClientProperties(groupedByCustomer)
    }
  }

  return (
    <div className='search-page center-margin'>
      { isLoading ? <div className='page-spinner'> <Spinner /> </div>
        :
        (
          <>
            <INSSearchForm onSubmit={onSubmit} />
          
            { clientProperties && Object.keys(clientProperties).length > 0 ?
              <div className='search-results-container'>
                <h1>Properties by Client <span className='italicized-record-count'>(Clients: {Object.keys(clientProperties).length})</span></h1>

                  {Object.keys(clientProperties).map((key:string) =>  (
                      <ClientCard 
                        key={key}
                        handleCardClick={handleCardClick}
                        // @ts-ignore
                        clientId={clientProperties[key][0].CNMBR} 
                        // @ts-ignore
                        clientName={clientProperties[key][0].CNAME} 
                        // @ts-ignore
                        clientProperties={clientProperties[key]} 
                      />
                    )
                  )}
              </div>
              : noResults ? <InfoCard line1='No Search Results Were Found' line2='For The Given Criteria'/>
              : <InfoCard line1='Search results will be displayed here'/>
            }
          </>
        )
      }

      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedInsTitleId && 
          <PropertyForm 
            propertyId={selectedInsTitleId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchINSTitlesPage