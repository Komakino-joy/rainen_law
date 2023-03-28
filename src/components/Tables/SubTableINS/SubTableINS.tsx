import { httpPostInsTitlesInfo } from '@/services/http';
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
      const {titles, count} = await httpPostInsTitlesInfo({inmbr} )
      setTableData(titles)
      setTitlesCount(count)
    })();
  },[])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: (d:any) => d.id,
      },
      {
        Header: 'Street',
        accessor: (d:any) => d.ISTRET || 'N/A',
      },
      {
        Header: 'City',
        accessor: (d:any) => d.ICITY || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d:any) => d.ILOT || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d:any) => d.ICONDO || 'N/A',
      },
      {
        Header: 'Unit',
        accessor: (d:any) => d.IUNIT || 'N/A',
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

export default SubTableINS
