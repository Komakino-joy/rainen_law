import { httpPostBuyerSellerInfo } from '@/services/http';
import { BuyerSeller } from '@/types/common';

import { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';

interface SubTableSellerBuyerProps {
  compRef: string;
}

const SubTableSellerBuyer:React.FC<SubTableSellerBuyerProps> = ({compRef}) => {

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    (async() => {
      const buyerSellerInfo = await httpPostBuyerSellerInfo({compRef})
      setTableData(buyerSellerInfo)
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
        accessor: (d:BuyerSeller) => d.PSELR1 || 'N/A',
      },
      {
        Header: 'Seller 2',
        accessor: (d:BuyerSeller) => d.PSELR2 || 'N/A',
      },
      {
        Header: 'Seller 3',
        accessor: (d:BuyerSeller) => d.PSELR3 || 'N/A',
      },
      {
        Header: 'Seller 4',
        accessor: (d:BuyerSeller) => d.PSELR4 || 'N/A',
      },
      {
        Header: 'Buyer 1',
        accessor: (d:BuyerSeller) => d.PBUYR1 || 'N/A',
      },
      {
        Header: 'Buyer 2',
        accessor: (d:BuyerSeller) => d.PBUYR2 || 'N/A',
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
    <table className='is-sub-table' {...getTableProps()}>
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
