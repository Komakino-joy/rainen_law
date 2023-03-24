import { Client, INSTitle, ModalType, Property } from '@/types/common';

import React, { useEffect, useRef, useState } from 'react'

import Modal from '@/components/Modal/Modal';
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import EditPropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import EditClientForm from '@/components/Forms/ClientEditForm/EditClientForm';
import EditINSForm from '@/components/Forms/INSEditForm/EditINSForm';
import axios from 'axios';
import PropertiesTable from '@/components/Tables/Properties/PropertiesTables';
import InsTitlesTable from '@/components/Tables/InsTitles/InsTitlesTable';
import Spinner from '@/components/Spinner/Spinner';
import HomeRecordPreviewCard from '@/components/HomeRecordPreviewCard/HomeRecordPreviewCard';

import styles from '../styles/home.module.scss'

const HomePage:React.FC = () =>  {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [propertyData, setPropertyData] = useState<Property[] | null>(null)
  const [clientData, setClientData] = useState<Client[] | null>(null)
  const [insTitleData, setInsTitleData] = useState<INSTitle[] | null>(null)

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string|null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string|null>(null)
  const [selectedInsTitleId, setSelectedInsTitleId] = useState<string|null>(null)
  
  
  const handleModalOpen =(e: React.SyntheticEvent, selectedRecordId: string, type: ModalType) => {
    e.preventDefault()
    
    switch(type) {
      case 'property':
        setSelectedPropertyId(selectedRecordId)
        break
      case 'client':
        setSelectedClientId(selectedRecordId)
        break
      case 'ins-title': 
        setSelectedInsTitleId(selectedRecordId)
        break
      default:
        break
    }

    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedPropertyId(null)
    setSelectedClientId(null)
    setSelectedInsTitleId(null)
    setShowModal(false)
  }

  const mounted = useRef(false);
  
  useEffect(() => {
    mounted.current = true;
    setIsLoading(true)

    const httpFetchPropertyData = async() => {
      const response =  await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-latest-updated-properties`)
      setPropertyData(response.data)
    } 

    const httpFetchClientData = async() => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/get-latest-updated-clients`)
      setClientData(response.data)
    }

    const httpFetchInsTitleData = async() => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/get-latest-updated-ins-titles`)
      setInsTitleData(response.data)
    }

    if(mounted) {
      httpFetchPropertyData()
      httpFetchClientData()
      httpFetchInsTitleData()
      setIsLoading(false)
    }
    
    return () => {
      mounted.current = false;
    }
  },[])

  if(isLoading) {
    return <div className='page-spinner'><Spinner/></div>
  }
  
  return (
    <div className={styles['homepage-wrapper']}>
        <div className={styles['homepage-content']}>
          <section>
            <div className={`light-border ${styles['welcome-header']}`}>
              <h1>Welcome, John S.</h1>
              <h2>{new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"})}</h2>
            </div>
          </section>
          <section>
            <h3>Recent Updates</h3>
            { propertyData && propertyData.length > 0 ?     
              <HomeRecordPreviewCard title='Properties' href='/properties/1'>
                <PropertiesTable 
                  tableData={propertyData} 
                  handleModalOpen={handleModalOpen} 
                  setTableData={() => {}}
                />
              </HomeRecordPreviewCard>      
              : null
            }

            { clientData && clientData.length > 0 ?
              <HomeRecordPreviewCard title='Clients' href='/clients/1'>
                <ClientsTable 
                  tableData={clientData} 
                  handleModalOpen={handleModalOpen}
                  setTableData={() => {}}
                  hiddenColumns={[
                    'Phone', 
                    'Fax', 
                    'Is Client?', 
                    'Properties', 
                    'Titles'
                  ]}
                />
              </HomeRecordPreviewCard>
              : null
            }

            { insTitleData && insTitleData.length > 0 ?
              <HomeRecordPreviewCard title='Insurance Titles' href='/ins-titles/1'>
                <InsTitlesTable 
                  tableData={insTitleData} 
                  handleModalOpen={handleModalOpen} 
                  setTableData={() => {}}    
                  hiddenColumns={[
                    'Client', 
                    'Premium Due', 
                    'Premium Paid', 
                    'Date Billed', 
                    'Notes', 
                    'Date Paid',
                    'L Policy Amt',
                    'O Policy Amt'
                  ]}      
                />
              </HomeRecordPreviewCard>
              : null
            }
          </section>
        </div>

      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedPropertyId && 
          <EditPropertyForm 
            propertyId={selectedPropertyId}
            queryType='update'
            handleAfterSubmit={() => {}}
          />
        }
        { selectedClientId && 
          <EditClientForm 
            clientId={selectedClientId}
            queryType='update'
            handleAfterSubmit={() => {}}
          />
        }
        { selectedInsTitleId && 
          <EditINSForm 
            insTitleId={selectedInsTitleId}
            queryType='update'
            handleAfterSubmit={() => {}}
          />
        }
      </Modal>
    </div>  
  )
}

export default HomePage