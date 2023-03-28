'use client';

import { Property } from '@/types/common';
import React, { useState } from 'react'
import Modal from '@/components/Modal/Modal';
import InfoCard from '@/components/InfoCard/InfoCard';
import ClientSearchForm from '@/components/Forms/ClientSearchForm/ClientSearchForm';
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import { useClientsContext } from '@/context/Clients';
import Spinner from '@/components/Spinner/Spinner';
import ClientForm from '@/components/Forms/ClientEditForm/EditClientForm';
import { httpPostSearchClient } from '@/services/http';

const SearchClientsPage = () => {
  const {isLoadingClientsContext} = useClientsContext()
  const isLoading = isLoadingClientsContext

  const [showModal, setShowModal] = useState(false);
  const [fetchingData, setFetchingData] = useState(false)
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
      setFetchingData(true)
      const searchResults = await httpPostSearchClient({data})
      setFetchingData(false)

      if(searchResults.length === 0) {
        setNoResults(true)
        setTableData(null)
        return 
      }
      
      setNoResults(false)

      setTableData(searchResults)
    }
  }

  return (
    <div className='search-page center-margin'>
      { isLoading ? <div className='page-spinner'> <Spinner /> </div>
        :
        (
          <>
            <ClientSearchForm onSubmit={onSubmit} />
          
            { fetchingData ? <div className='search-results-spinner'><Spinner /></div>
              : tableData && Object.keys(tableData).length > 0 ?

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
          </>
        )
      }

      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedclientId && 
          <ClientForm 
            clientId={selectedclientId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchClientsPage