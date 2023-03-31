import { ModalType, Property } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { PencilIcon } from '@/components/Icons/Icons';
import PrintClientLabel from '@/components/PrintClientLabel/PrintClientLabel';

interface ClientsTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, id: string, type:ModalType) => void;
  setTableData: (tableData: Property[]) => void;
  hiddenColumns?: string[];
}

const ClientsTable:React.FC<ClientsTableProps> = ({
  tableData,
  handleModalOpen,
  hiddenColumns=['']
}) => {

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Client Name',
        accessor: (d:any) => d.CNAME,
      },
      {
        Header: 'Address',
        accessor: (d:any) => `${d.CADD1} ${d.CADD2 ? d.CADD2 : ''}`,
      },
      {
        Header: 'City',
        accessor: (d:any) => d.CCITY || 'N/A',
      },
      {
        Header: 'State',
        accessor: (d:any) => d.CSTATE || 'N/A',
      },
      {
        Header: 'Zip',
        accessor: (d:any) => d.CZIP || 'N/A',
      },
      {
        Header: 'Phone',
        accessor: (d:any) => d.CPHONE || 'N/A',
      },
      {
        Header: 'Fax',
        accessor: (d:any) => d.CFAX || 'N/A',
      },
      {
        Header: 'Is Client?',
        accessor: (d:any) => d.ISCLIENT ? 'Yes' : "No",
      },
      {
        Header: 'Properties',
        accessor: (d:any) => d.PROPCOUNT || 'N/A',
      },
      {
        Header: 'Titles',
        accessor: (d:any) => d.TITLESCOUNT || 'N/A',
      },
      {
        Header: 'Print',
        accessor: (d:any) => d,
        Cell: ({value}:{value:any}) => (
          <span 
          title={`Print Property: ${value.id}`} 
          >
            <PrintClientLabel 
              usePrinterIcon={true}
              clientInfo={value}
            />
          </span>
        )
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.id,
        Cell: ({value}:{value:any}) => (
          <span
            title={`Edit Client: ${value}`} 
            onClick={(e) => handleModalOpen(e, value, 'client')}
          >
            <PencilIcon />
          </span>
        )
      }
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
      //@ts-ignore
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      initialState: {
        hiddenColumns
      }
    },
    useFilters, // useFilters!
  )

  return (
    <table className='is-all-clients-table' {...getTableProps()}>
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

export default ClientsTable
