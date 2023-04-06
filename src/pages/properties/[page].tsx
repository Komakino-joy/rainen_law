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
import dbRef from '@/constants/dbRefs';

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `
      SELECT 
        COUNT(*) 
      FROM ${dbRef.table_names.properties}
    `

    const totalRecordsResult = (
      await conn.query(totalRecordsQuery)
    ).rows[0].count;

    const allProperties = `
      SELECT 
        c.${dbRef.clients.c_name},
        p.${dbRef.properties.p_input_date},
        p.${dbRef.properties.p_city},
        p.${dbRef.properties.p_street},
        p.${dbRef.properties.p_lot},
        p.${dbRef.properties.p_condo},
        p.${dbRef.properties.p_unit},
        p.${dbRef.properties.p_number},
        p.${dbRef.properties.p_requester},
        p.${dbRef.properties.p_type},
        p.${dbRef.properties.p_status},
        p.${dbRef.properties.p_comp_ref},
        p.${dbRef.properties.p_instructions},
        p.${dbRef.properties.id}
      FROM ${dbRef.table_names.properties} p
      LEFT JOIN ${dbRef.table_names.clients} c 
        ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
      ORDER BY 
        p.${dbRef.properties.last_updated} DESC,
        p.${dbRef.properties.p_input_date} DESC,
        p.${dbRef.properties.id} DESC
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
  },[properties])

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