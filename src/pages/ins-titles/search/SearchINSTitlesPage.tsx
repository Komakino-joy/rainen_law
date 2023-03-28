'use client';

import React, { useState } from 'react'
import Modal from '@/components/Modal/Modal';
import InfoCard from '@/components/InfoCard/InfoCard';
import INSSearchForm from '@/components/Forms/INSSearchForm/INSSearchForm';
import { useINSTitlesContext } from '@/context/INSTitles';
import Spinner from '@/components/Spinner/Spinner';
import PoliciesByCompanyCard from '@/components/PoliciesByCompanyCard/PoliciesByCompanyCard';
import { Policy } from '@/types/common';
import EditINSForm from '@/components/Forms/INSEditForm/EditINSForm';
import { httpPostSearchInsTitle } from '@/services/http';

const SearchINSTitlesPage = () => {
  const {isLoadingINSTitlescontext} = useINSTitlesContext()
  

  const [showModal, setShowModal] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [policiesByCompany, setPoliciesByCompany] = useState(null)
  const [selectedInsTitleId, setSelectedInsTitleId] = useState<string|null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)

  const isLoading = isLoadingINSTitlescontext

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
    if(Object.keys(data).every(key => data[key] === '' || data[key] === undefined || data[key] === null)) {
      alert('No search parameters were provided.')
    } else {
      setFetchingData(true)
      const searchResults = await httpPostSearchInsTitle({data})
      setFetchingData(false)

      if(searchResults.length === 0) {
        setNoResults(true)
        setPoliciesByCompany(null)
        return 
      }
      
      setNoResults(false)

      const groupedByCompanyName = searchResults.reduce((acc: any, policy: Policy) => {
        type propKeyT = keyof typeof policy
        if (!acc[policy.tticoname as propKeyT]) {
          acc[policy.tticoname as propKeyT] = []
        } 
        acc[policy.tticoname as keyof typeof policy].push(policy)
        return acc
      },{})

      setPoliciesByCompany(groupedByCompanyName)
    }
  }

  return (
    <div className='search-page center-margin'>
      { isLoading ? <div className='page-spinner'> <Spinner /> </div>
        :
        (
          <>
            <INSSearchForm onSubmit={onSubmit} />
          
            { fetchingData ? <div className='search-results-spinner'><Spinner /></div>
              : policiesByCompany && Object.keys(policiesByCompany).length > 0  ?
              <div className='search-results-container'>
                <h1>Properties by Company <span className='italicized-record-count'>(Companies: {Object.keys(policiesByCompany).length})</span></h1>

                  {Object.keys(policiesByCompany).map((key:string) =>  (
                      <PoliciesByCompanyCard 
                        key={key}
                        handleCardClick={handleCardClick}
                        // @ts-ignore
                        policyId={policiesByCompany[key][0].TITLECO} 
                        // @ts-ignore
                        companyName={policiesByCompany[key][0].tticoname} 
                        // @ts-ignore
                        policiesByCompany={policiesByCompany[key]} 
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
          <EditINSForm
            insTitleId={selectedInsTitleId}
            queryType='update' 
          />
        }
      </Modal>
      
    </div>
  )
}

export default SearchINSTitlesPage