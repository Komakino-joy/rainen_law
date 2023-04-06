import { DownArrowIcon, UpArrowIcon, SortIcon } from '@/components/Icons/Icons';
import dbRef from '@/constants/dbRefs';
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
  },[compRef])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Seller 1',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.seller_1 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Seller 2',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.seller_2 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Seller 3',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.seller_3 as keyof BuyerSeller]|| 'N/A',
      },
      {
        Header: 'Seller 4',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.seller_4 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Buyer 1',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.buyer_1 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Buyer 2',
        accessor: (d:BuyerSeller) => d[dbRef.buyer_seller.buyer_2 as keyof BuyerSeller]  || 'N/A',
      }
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {}
    },
    useFilters
  )

  return (
    <table className='is-sub-table' {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup,idx) => (
        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
          {headerGroup.headers.map((column, idx) => (
            <span key={column.id}>
              {column.render('Header')}
              {column.Header === 'Print' 
                || column.Header === 'View / Edit'  ? null
                : column.isSorted
                ? column.isSortedDesc
                ? <DownArrowIcon />
                : <UpArrowIcon />
                : <SortIcon />
              }
            </span>
          ))}
        </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row,idx) => {
          prepareRow(row)
          return (
            <tr{...row.getRowProps()} key={row.id}>
              {row.cells.map((cell, idx) => (
                <td
                  {...cell.getCellProps()}
                  key={cell.row.id}
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
