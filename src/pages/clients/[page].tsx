import { Property } from '@/types/common';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination'
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import EditClientForm from '@/components/Forms/ClientEditForm/EditClientForm';
import conn from '../../lib/db'
import InfoCard from '@/components/InfoCard/InfoCard';

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public."propmstr"`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const allClients = `
        SELECT 
            cm.id,
            cm."CNMBR",
            cm."CNAME",
            cm."CADD1",
            cm."CADD2",
            cm."CCITY",
            cm."CSTATE",
            cm."CZIP",
            cm."CPHONE",
            cm."CFAX",
            true as "ISCLIENT",
            COALESCE(pc."PROPCOUNT", 0) as "PROPCOUNT",
            COALESCE(i."TITLESCOUNT", 0) as "TITLESCOUNT"
        FROM public."clntmstr" cm
        LEFT JOIN (
            SELECT 
                pm."PNMBR", 
                COUNT(*) AS "PROPCOUNT" 
            FROM public.propmstr pm
            GROUP BY pm."PNMBR"
        ) pc ON pc."PNMBR" = cm."CNMBR"
        LEFT JOIN (
            SELECT 
                i."INMBR", 
                COUNT(*) AS "TITLESCOUNT" 
            FROM public.ins i
            GROUP BY i."INMBR"
        ) i ON i."INMBR" = cm."CNMBR"
      ORDER BY cm."CNAME"
      OFFSET $1 LIMIT ${pageSize};
    `
    const clientsResults = JSON.parse(JSON.stringify((await conn.query(allClients, [pageOffset])).rows));
    return { 
      props: {
        clients: clientsResults,
        totalRecords: Number(totalRecordsResult),
        pageSize, 
        currentPage: Number(page)
      } 
    }
}

interface ClientsProps {
  clients: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const Clients:React.FC<ClientsProps> = ({
  clients, 
  totalRecords, 
  pageSize, 
  currentPage
}) =>  {
  const router = useRouter()

  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Property[] | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  const handleModalOpen =(e: React.SyntheticEvent, clientId: string) => {
    e.preventDefault()
    setSelectedClientId(clientId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedClientId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (clientId: string) => {
    setShouldReload(true)
  }

  useEffect(() => {
    setTableData(clients)
  },[])

  
  return (
    <>
      { tableData ? 
        <div className='all-records-view-page'>
          <h1>
            All Clients 
            <span className='italicized-record-count'>
              page ({currentPage}/{Math.floor(totalRecords/pageSize)})
            </span>
          </h1>

          <ClientsTable 
            tableData={tableData} 
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          <Pagination 
            href={'clients'} 
            totalRecords={totalRecords} 
            pageSize={pageSize} 
            currentPage={currentPage} 
          />
        </div>
        : <InfoCard customStyles={{marginTop: '100px', border: 'none'}}  line1='No Data to Show'/>
      }

      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedClientId && 
          <EditClientForm 
            clientId={selectedClientId}
            queryType='update'
            handleAfterSubmit={handleAfterSubmit}
          />
        }
      </Modal>
    </>  
  )
}

export default Clients