import { Property } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';

import { timestampToDate } from '@/utils';

import styles from './ReportProperties.module.scss'

interface ReportPropertiesProps {
  tableData: Property[];
}

const ReportProperties:React.FC<ReportPropertiesProps> = ({
  tableData
}) => {

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Request Date',
        accessor: (d:any) => timestampToDate(d.PTDATE, 'mmDDyyyy').date,
      },
      {
        Header: 'Address',
        accessor: (d:any) => `${d.PLOT} ${d.PSTRET} ${d.PCITY}`,
      },
      {
        Header: 'Ref No.',
        accessor: (d:any) => d.PCOMPREF,
      },
      {
        Header: 'Given to examiner',
        accessor: (d:any) => `${d.PASIGN ? "Yes" : "No"}`,
      },
      {
        Header: 'Client',
        accessor: (d:any) => `(${d.PNMBR}) ${d.CNAME}`,
      },
      {
        Header: 'Type',
        accessor: (d:any) => d.PTYPE
      },
    ],
    [tableData]
  )
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      //@ts-ignore
      columns,
      data,
      initialState: {}
    },
    useFilters, // useFilters!
  )

  return (
    <table id={styles['property-report']} {...getTableProps()} className='is-report-table'>
      <thead>
        {headerGroups.map((headerGroup,idx) => (
        //@ts-ignore
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, idx) => (
            //@ts-ignore
            <th {...column.getHeaderProps()} >
              {column.render('Header')}
            </th>
          ))}
        </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row,idx) => {
          prepareRow(row)
          return (
            // @ts-ignore 
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, idx) => (
                <td
                  // @ts-ignore
                  key={idx}
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
          })}
      </tbody>
    </table>
  )
}

export default ReportProperties
