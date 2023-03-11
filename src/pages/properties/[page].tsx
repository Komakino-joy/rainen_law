"use client";
import React from 'react'
import conn from '../../lib/db'
import Pagination from '@/components/Pagination/Pagination'
import PropertiesTable from '@/components/Tables/PropertiesTable'
// import '../../styles/globals.scss'

export async function getServerSideProps(context:any) {
    const { page } = context.query
    const pageSize = 50
    const pageOffset = pageSize * (page - 1)

    const totalRecordsQuery = `select COUNT(*) from public."propmstr"`
    const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;

    const allProperties = `
      SELECT 
        cm."CNAME",
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
        pm."PINSTR"
      FROM public."propmstr" pm
      LEFT JOIN public."clntmstr" cm 
      ON cm."CNMBR" = pm."PNMBR"
      ORDER BY pm."PNMBR"
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
}) =>  (
  <div>
    <h1 className='report-header'>Properties</h1>
    <PropertiesTable tableData={properties} />
    <Pagination 
      href={'properties'} 
      totalRecords={totalRecords} 
      pageSize={pageSize} 
      currentPage={currentPage} 
    />
  </div>
)

export default Properties