import axios from 'axios';

import { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';

interface SubTableSellerBuyerProps {
  compRef: string;
}

const SubTableSellerBuyer:React.FC<SubTableSellerBuyerProps> = ({compRef}) => {

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async() => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/buyerseller/post-buyer-seller-info`, {PCOMPREF: compRef} )
      setTableData(response.data)
    })();
  },[])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Seller 1',
        accessor: (d:any) => d.PSELR1,
      },
      {
        Header: 'Seller 2',
        accessor: (d:any) => d.SELR2,
      },
      {
        Header: 'Seller 3',
        accessor: (d:any) => d.PSELR3,
      },
      {
        Header: 'Seller 4',
        accessor: (d:any) => d.PSELR4,
      },
      {
        Header: 'Buyer 1',
        accessor: (d:any) => d.BUYR1,
      },
      {
        Header: 'Buyer 2',
        accessor: (d:any) => d.BUYR2,
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

export default SubTableSellerBuyer
