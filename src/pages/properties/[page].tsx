import { Property } from '@/types/common';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import Pagination from '@/components/Pagination/Pagination'
import PropertiesTable from '@/components/Tables/Properties/PropertiesTable'
import conn from '../../lib/db'
import InfoCard from '@/components/InfoCard/InfoCard';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public.properties`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const allProperties = `
      SELECT 
        cm."CNAME",
        pm.p_input_date,
        pm.p_city,
        pm.p_street,
        pm.p_lot,
        pm.p_condo,
        pm.p_unit,
        pm.p_number,
        pm.p_requester,
        pm.p_type,
        pm.p_status,
        pm.p_comp_ref,
        pm.p_instructions,
        pm.id
      FROM public.properties pm
      LEFT JOIN public.clntmstr cm 
      ON cm."CNMBR" = pm.p_number
      ORDER BY 
        pm.last_updated DESC,
        pm.p_input_date DESC,
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
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  const handleModalOpen =(e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    confirmAlert({
      message: 'Are you sure to edit this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setSelectedId(id)
            setShowModal(true)
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'edit-property'
          })
        }
      ]
    })
  }

  const handleModalClose = () => {
    setSelectedId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (id: string) => {
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
          selectedId={selectedId} 
          handleAfterSubmit={handleAfterSubmit} 
        />
    </>  
  )
}

export default Properties