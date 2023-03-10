import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';

import './PropertiesTable.scss';

interface PropertiesTableProps {
  tableData: any;
}

const PropertiesTable:React.FC<PropertiesTableProps> = ({tableData}) => {
  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'City',
        accessor: (d:any) => `${d.PCITY}`,
      },
      {
        Header: 'Street',
        accessor: (d:any) => `${d.PSTRET}`,
      },
      {
        Header: 'Lot',
        accessor: (d:any) => `${d.PLOT}`,
      },
      {
        Header: 'Condo',
        accessor: (d:any) => `${d.PCONDO}`,
      },

      {
        Header: 'Unit',
        accessor: (d:any) => `${d.PUNIT}`,
      },
      {
        Header: 'Client',
        accessor: (d:any) => `${d.PNMBR}: ${d.CNAME}`,
      },

      {
        Header: 'Requester',
        accessor: (d:any) => `${d.PREQ}`,
      },
      {
        Header: 'Type',
        accessor: (d:any) => `${d.PTYPE}`,
      },
      {
        Header: 'Status',
        accessor: (d:any) => `${d.PSTAT}`,
      },
      {
        Header: 'PCOMPREF',
        accessor: (d:any) => `${d.PCOMPREF}`,
      },
      {
        Header: 'PINSTR',
        accessor: (d:any) => `${d.PINSTR}`,
      },
    ],
    [tableData]
  )
  
  // Define a default UI for filtering
  function DefaultColumnFilter () {
    return null
  }

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
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
      defaultColumn, // Be sure to pass the defaultColumn option
      initialState: {}
    },
    useFilters, // useFilters!
  )

  return (
    <table {...getTableProps()} id='properties-table'>
      <thead>
        {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()} >
              {column.render('Header')}
            </th>
          ))}
        </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td
                  {...cell.getCellProps()}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    borderBottom: '1px solid lightgrey',
                  }}
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

export default PropertiesTable
