import { Client, ModalType } from '@/types/common';

import { useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';

import { PencilIcon } from '@/components/Icons/Icons';
import PrintPropertyMultiple from '@/components/PrintPropertyMultiple/PrintPropertyMultiple';
import styles from './ClientsTable.module.scss'
import PrintClientLabelMultiple from '@/components/PrintClientLabelMultiple/PrintClientLabelMultiple';

interface ClientsTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, id: string, type:ModalType) => void;
  setTableData: (tableData: Client[]) => void;
  hiddenColumns?: string[];
}

const ClientsTable:React.FC<ClientsTableProps> = ({
  tableData,
  handleModalOpen,
  hiddenColumns=['']
}) => {

  const [labelsToPrint, setLabelsToPrint] = useState<Client[]>([])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Client#',
        accessor: (d:any) => d.c_number,
      },
      {
        Header: 'Client Name',
        accessor: (d:any) => d.c_name,
      },
      {
        Header: 'Address',
        accessor: (d:any) => `${d.c_address_1} ${d.c_address_2 ? d.c_address_2 : ''}`,
      },
      {
        Header: 'City',
        accessor: (d:any) => d.c_city || 'N/A',
      },
      {
        Header: 'State',
        accessor: (d:any) => d.c_state || 'N/A',
      },
      {
        Header: 'Zip',
        accessor: (d:any) => d.c_zip || 'N/A',
      },
      {
        Header: 'Phone',
        accessor: (d:any) => d.c_phone || 'N/A',
      },
      {
        Header: 'Fax',
        accessor: (d:any) => d.c_fax || 'N/A',
      },
      {
        Header: 'Is Client?',
        accessor: (d:any) => d.c_is_client ? 'Yes' : "No",
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
        accessor: (d:Client) => d,
        Cell: ({value}:{value:any}) => (
          <input
            name={`client-${value.id}`}
            type='checkbox'
            onClick={(e) => {
              const ischecked = (e.target as HTMLInputElement).checked
              if(ischecked) {
                setLabelsToPrint((prevState) => {
                  const updatedArray = [...prevState, value]
                  return updatedArray
                })
              } else {
                setLabelsToPrint((prevState) => {
                  const filteredArray = prevState.filter(client => (
                    client.id !== value.id
                  ))
                  return filteredArray
                })
              }
            }}
          />
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
    useSortBy,
  )

  return (
    <div className={styles.container}>
    { labelsToPrint.length > 0 &&
      <div className={styles['button-container']}>
        <PrintClientLabelMultiple clients={labelsToPrint}>
          {`Print ${labelsToPrint.length} ${labelsToPrint.length === 1 ? 'Label' : 'Labels'}`}
        </PrintClientLabelMultiple>
      </div>
    }
      <table className='is-all-clients-table' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup,idx) => (
          //@ts-ignore
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, idx) => (
              //@ts-ignore
              <th 
                {...column.getHeaderProps(column.getSortByToggleProps())} 
                className={
                  column.isSorted
                    ? column.isSortedDesc
                      ? "desc"
                      : "asc"
                    : ""
                  }
              >
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
    </div>
  )
}

export default ClientsTable
