import axios from 'axios';

import { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';

interface SubTableINSProps {
  inmbr: string;
  setTitlesCount: any;
}

const SubTableINS:React.FC<SubTableINSProps> = ({
  inmbr, 
  setTitlesCount
}) => {

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async() => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/post-ins-titles-info`, {inmbr} )
      setTableData(response.data.titles)
      setTitlesCount(response.data.count)
    })();
  },[])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Street',
        accessor: (d:any) => d.ISTRET,
      },
      {
        Header: 'City',
        accessor: (d:any) => d.ICITY,
      },
      {
        Header: 'Lot',
        accessor: (d:any) => d.ILOT,
      },
      {
        Header: 'Condo',
        accessor: (d:any) => d.ICONDO,
      },
      {
        Header: 'Unit',
        accessor: (d:any) => d.IUNIT,
      }
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
    <table className='is-sub-report-table' {...getTableProps()}>
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

export default SubTableINS
