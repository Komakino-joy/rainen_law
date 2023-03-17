'use client';

import { Property } from '@/types/common';
import React, { useState } from 'react'
import axios from 'axios';
import Modal from '@/components/Modal/Modal';
import PropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import InfoCard from '@/components/InfoCard/InfoCard';
import ClientSearchForm from '@/components/Forms/ClientSearchForm/ClientSearchForm';
import ClientsTable from '@/components/Tables/ClientsTable/ClientsTable';

const SearchClientsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedclientId, setSelectedclientId] = useState<string|null>(null)
  const [tableData, setTableData] = useState<Property[] | null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)

  const handleOpenModal =(e: React.SyntheticEvent, clientId: string) => {
    e.preventDefault()
    setSelectedclientId(clientId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedclientId(null)
    setShowModal(false)
  }

  const onSubmit = async (data:any) => {
    if(Object.keys(data).every(key => data[key] === '' || data[key] === undefined || data[key] === null)) {
      alert('No search parameters were provided.')
    } else {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/post-search-client`, data)
      
      if(response.data.length === 0) {
        setNoResults(true)
        setTableData(null)
        return 
      }
      
      setNoResults(false)

      setTableData(response.data)
    }
  }

  return (
    <div className='search-page center-margin'>
      <ClientSearchForm onSubmit={onSubmit} />
      
      
        { tableData && Object.keys(tableData).length > 0 ?

            <div className='search-results-table-wrapper is-client-table'>           
              <ClientsTable 
                tableData={tableData} 
                handleModalOpen={handleOpenModal} 
                setTableData={setTableData} 
              />
            </div>

          : noResults ? <InfoCard line1='No Search Results Were Found' line2='For The Given Criteria'/>
          : <InfoCard line1='Search results will be displayed here'/>
        }

    
      <Modal
          onClose={handleModalClose}
          show={showModal}
          title={''}
      >
        { selectedclientId && 
          <PropertyForm 
            propertyId={selectedclientId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchClientsPage