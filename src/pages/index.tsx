import { Client, ModalType, Property } from '@/types/common';

import React, { useEffect, useRef, useState } from 'react'

import Modal from '@/components/Modal/Modal';
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import EditPropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import EditClientForm from '@/components/Forms/ClientEditForm/EditClientForm';
import PropertiesTable from '@/components/Tables/Properties/PropertiesTable';
import Spinner from '@/components/Spinner/Spinner';
import HomeRecordPreviewCard from '@/components/HomeRecordPreviewCard/HomeRecordPreviewCard';

import styles from '../styles/home.module.scss'
import { useAuth } from '@/context/AuthContext';
import { 
  httpGetLatestUpdatedClients,
  httpGetLatestUpdatedProperties 
} from '@/services/http';

const HomePage:React.FC = () =>  {
  const {user} = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [propertyData, setPropertyData] = useState<Property[] | null>(null)
  const [clientData, setClientData] = useState<Client[] | null>(null)

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string|null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string|null>(null)
  
  const handleModalOpen =(e: React.SyntheticEvent, selectedRecordId: string, type: ModalType) => {
    e.preventDefault()
    
    switch(type) {
      case 'property':
        setSelectedPropertyId(selectedRecordId)
        break
      case 'client':
        setSelectedClientId(selectedRecordId)
        break
      default:
        break
    }

    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedPropertyId(null)
    setSelectedClientId(null)
    setShowModal(false)
  }

  const mounted = useRef(false);
  
  useEffect(() => {
    mounted.current = true;
    setIsLoading(true)

    const httpFetchPropertyData = async() => {
      const properties =  await httpGetLatestUpdatedProperties()
      setPropertyData(properties)
    } 

    const httpFetchClientData = async() => {
      const clients = await httpGetLatestUpdatedClients()
      setClientData(clients)
    }

    if(mounted) {
      httpFetchPropertyData()
      httpFetchClientData()
      setIsLoading(false)
    }
    
    return () => {
      mounted.current = false;
    }
  },[])

  const allDataLoaded = 
    propertyData && propertyData.length > 0
    && clientData && clientData.length > 0

  if(isLoading || !allDataLoaded) {
    return <div className='page-spinner'><Spinner/></div>
  }
  
  return (
    <div className={styles['homepage-wrapper']}>
        <div className={styles['homepage-content']}>
          <section>
            <div className={`light-border ${styles['welcome-header']}`}>
              <h1>{`Welcome, ${user.f_name} ${user.l_name[0]}.`}</h1>
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
      </Modal>
    </div>  
  )
}

export default HomePage