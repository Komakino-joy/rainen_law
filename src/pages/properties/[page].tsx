import { Property } from '@/types/common';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import Pagination from '@/components/Pagination/Pagination'
import PropertiesTable from '@/components/Tables/PropertiesTable/PropertiesTables'
import conn from '../../lib/db'
import InfoCard from '@/components/InfoCard/InfoCard';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public.propmstr`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const allProperties = `
      SELECT 
        cm."CNAME",
        pm."PTDATE",
        pm."PCITY",
        pm."PSTRET",
        pm."PLOT",
        pm."PCONDO",
        pm."PUNIT",
        pm."PNMBR",
        pm."PREQ",
        pm."PTYPE",
        pm."PSTAT",
        pm."PCOMPREF",
        pm."PINSTR",
        pm.id
      FROM public.propmstr pm
      LEFT JOIN public.clntmstr cm 
      ON cm."CNMBR" = pm."PNMBR"
      ORDER BY 
        pm.last_updated DESC,
        pm."PTDATE" DESC,
        pm.id DESC
      OFFSET $1 LIMIT ${pageSize}
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
      { tableData ? 
        <div className='all-records-view-page'>
          <h1>
            All Properties 
            <span className='italicized-record-count'>
              page ({currentPage}/{Math.floor(totalRecords/pageSize)})
            </span>
          </h1>

          <PropertiesTable 
            tableData={tableData} 
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          <Pagination 
            href={'properties'} 
            totalRecords={totalRecords} 
            pageSize={pageSize} 
            currentPage={currentPage} 
          />
        </div>
        : <InfoCard customStyles={{marginTop: '100px', border: 'none'}} line1='No Data to Show'/>
      }

        <EditPropertyModal 
          handleModalClose={handleModalClose} 
          showModal={showModal} 
          title={''}
          selectedPropId={selectedPropId} 
          handleAfterSubmit={handleAfterSubmit} 
        />
    </>  
  )
}

export default Properties