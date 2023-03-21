import { INSTitle } from '@/types/common';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import Pagination from '@/components/Pagination/Pagination'
import InsTitlesTable from '@/components/Tables/InsTitlesTable/InsTitlesTable';
import conn from '../../lib/db'
import InfoCard from '@/components/InfoCard/InfoCard';
import EditInsTitleModal from '@/components/Modals/EditInsTitleModal';

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public.ins`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const insTitles = `
      SELECT 
          ins."id", 
          ins."IFILE", 
          ins."IBILL", 
          ins."ICITY", 
          ins."ISTRET", 
          ins."ILOT", 
          ins."ICONDO", 
          ins."IUNIT", 
          cm."CNAME", 
          ins."PREMDUE", 
          ins."PREMPAID", 
          ins."ICDATE", 
          ins."IPOLDATE", 
          ins."INOTES", 
          ins."IPDATE", 
          ins."LPOLICYNUM", 
          ins."OPOLICYNUM",
          ins."LPOLICYAMT",
          ins."OPOLICYAMT", 
          ins.last_viewed
      FROM public.ins ins 
      LEFT JOIN public.clntmstr cm ON ins."INMBR" = cm."CNMBR"
      ORDER BY 
          ins."IFILE", 
          ins."IBILL", 
          ins."ICITY", 
          ins."ISTRET", 
          ins."ILOT", 
          ins."ICONDO", 
          ins."IUNIT", 
          cm."CNAME", 
          ins."PREMDUE", 
          ins."PREMPAID", 
          ins."ICDATE", 
          ins."IPOLDATE", 
          ins."INOTES", 
          ins."IPDATE", 
          ins."LPOLICYNUM", 
          ins."OPOLICYNUM", 
          ins."LPOLICYAMT", 
          ins."OPOLICYAMT", 
          ins.last_viewed
        OFFSET $1 LIMIT ${pageSize}
      `
    const insTitlesResults = JSON.parse(JSON.stringify((await conn.query(insTitles, [pageOffset])).rows));

    return { 
      props: {
        insTitles: insTitlesResults,
        totalRecords: Number(totalRecordsResult),
        pageSize, 
        currentPage: Number(page)
      } 
    }
}

interface InsTitlesProps {
  insTitles: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const InsTitles:React.FC<InsTitlesProps> = ({
  insTitles, 
  totalRecords, 
  pageSize, 
  currentPage
}) =>  {
  const router = useRouter()

  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<INSTitle[] | null>(null)
  const [selectedInsTitleId, setSelectedInsTitleId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  const handleModalOpen =(e: React.SyntheticEvent, insTitleId: string) => {
    e.preventDefault()
    setSelectedInsTitleId(insTitleId)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedInsTitleId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (insTitleId: string) => {
    setShouldReload(true)
  }

  useEffect(() => {
    setTableData(insTitles)
  },[])

  return (
    <>
      { tableData ? 
        <div className='all-records-view-page'>
          <h1>
            All Insurance Titles 
            <span className='italicized-record-count'>
              page ({currentPage}/{Math.floor(totalRecords/pageSize)})
            </span>
          </h1>

          <InsTitlesTable 
            tableData={tableData} 
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          <Pagination 
            href={'insTitles'} 
            totalRecords={totalRecords} 
            pageSize={pageSize} 
            currentPage={currentPage} 
          />
        </div>
        : <InfoCard customStyles={{marginTop: '100px', border: 'none'}} line1='No Data to Show'/>
      }

        <EditInsTitleModal 
          handleModalClose={handleModalClose} 
          showModal={showModal} 
          title={''}
          selectedInsTitleId={selectedInsTitleId} 
          handleAfterSubmit={handleAfterSubmit} 
        />
    </>  
  )
}

export default InsTitles