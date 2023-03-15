"use client";
import { Property } from '@/types/common';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination'
import ClientsTable from '@/components/Tables/ClientsTable/ClientsTable';
import EditPropertyForm from '@/components/Forms/PropertyEditForm/EditPropertyForm';
import conn from '../../lib/db'

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public."propmstr"`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const allProperties = `
      SELECT * FROM (
        SELECT 
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
        UNION
        SELECT 
            nm."CNMBR",
            nm."CNAME",
            nm."CADD1",
            nm."CADD2",
            nm."CCITY",
            nm."CSTATE",
            nm."CZIP",
            nm."CPHONE",
            nm."CFAX",
            false as "ISCLIENT",
            0 as "PROPCOUNT" ,
            0 as "TITLESCOUNT"
        FROM public."nonmstr" nm
      ) t1
      ORDER BY t1."CNAME"
      OFFSET $1 LIMIT ${pageSize};
    `
    const propertiesResults = JSON.parse(JSON.stringify((await conn.query(allProperties, [pageOffset])).rows));
    return { 
      props: {
        properties: propertiesResults,
        totalRecords: Number(totalRecordsResult),
        pageSize, 
        currentPage: Number(page)
      } 
    }
}

interface PropertiesProps {
  properties: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const Properties:React.FC<PropertiesProps> = ({
  properties, 
  totalRecords, 
  pageSize, 
  currentPage
}) =>  {
  const router = useRouter()

  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Property[] | null>(null)
  const [selectedPropId, setSelectedPropId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  const handleModalOpen =(e: React.SyntheticEvent, propId: string) => {
    e.preventDefault()
    setSelectedPropId(propId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedPropId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (propId: string) => {
    setShouldReload(true)
  }

  useEffect(() => {
    setTableData(properties)
  },[])

  
  return (
    <>
      { tableData && 
        <>
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
        </>
      }

      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectedPropId && 
          <EditPropertyForm 
            propertyId={selectedPropId}
            queryType='update'
            handleAfterSubmit={handleAfterSubmit}
          />
        }
      </Modal>
    </>  
  )
}

export default Properties