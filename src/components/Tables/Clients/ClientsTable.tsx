import { Client, ModalType } from '@/types/common'

import { useMemo, useState } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import { v4 as uuidv4 } from 'uuid'

import { DownArrowIcon, PencilIcon, SortIcon, UpArrowIcon } from '@/components/Icons/Icons'
import styles from './ClientsTable.module.scss'
import PrintClientLabelMultiple from '@/components/PrintClientLabelMultiple/PrintClientLabelMultiple'
import dbRef from '@/constants/dbRefs'

interface ClientsTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, id: string, type:ModalType) => void;
  setTableData: (tableData: Client[]) => void;
  hiddenColumns?: string[];
  isHomePreviewTable?: boolean;
}

const ClientsTable:React.FC<ClientsTableProps> = ({
  tableData,
  handleModalOpen,
  hiddenColumns=[''],
  isHomePreviewTable
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
        accessor: (d:Client) => d[dbRef.clients.c_number as keyof Client],
      },
      {
        Header: 'Client Name',
        accessor: (d:Client) => d[dbRef.clients.c_name as keyof Client],
      },
      {
        Header: 'Address',
        accessor: (d:Client) => `
          ${d[dbRef.clients.c_address_1 as keyof Client]} 
          ${d[dbRef.clients.c_address_2 as keyof Client] 
            ? d[dbRef.clients.c_address_2 as keyof Client]
            : ''
          }
        `,
      },
      {
        Header: 'City',
        accessor: (d:Client) => d[dbRef.clients.c_city as keyof Client] || 'N/A',
      },
      {
        Header: 'State',
        accessor: (d:Client) => d[dbRef.clients.c_state as keyof Client] || 'N/A',
      },
      {
        Header: 'Zip',
        accessor: (d:Client) => d[dbRef.clients.c_zip as keyof Client] || 'N/A',
      },
      {
        Header: 'Phone',
        accessor: (d:Client) => d[dbRef.clients.c_phone as keyof Client] || 'N/A',
      },
      {
        Header: 'Fax',
        accessor: (d:Client) => d[dbRef.clients.c_fax as keyof Client] || 'N/A',
      },
      {
        Header: 'Properties',
        accessor: (d:Client) => d.propcount || 'N/A',
      },
      {
        Header: 'Titles',
        accessor: (d:Client) => d.titlescount || 'N/A',
      },
      {
        Header: 'Print',
        accessor: (d:Client) => d,
        Cell: ({value}:{value:Client}) => (
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
        accessor: (d:any) => d[dbRef.clients.id as keyof Client],
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
    [handleModalOpen]
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
      defaultColumn, 
      initialState: {
        hiddenColumns
      }
    },
    useFilters,
    useSortBy
  )

  const buttonContainerClassName = isHomePreviewTable ? styles['home-preview-button-container'] : styles['button-container']

  return (
    <div className={styles.container}>
    { labelsToPrint.length > 0 &&
      <div className={buttonContainerClassName}>
        <PrintClientLabelMultiple clients={labelsToPrint}>
          {`Print ${labelsToPrint.length} ${labelsToPrint.length === 1 ? 'Label' : 'Labels'}`}
        </PrintClientLabelMultiple>
      </div>
    }
      <table className='is-all-clients-table' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup,idx) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
            {headerGroup.headers.map((column, idx) => (
              <th 
                {...column.getHeaderProps( !isHomePreviewTable ? column.getSortByToggleProps() : undefined)} 
                key={uuidv4()}
                className={
                  column.isSorted
                    ? column.isSortedDesc
                      ? 'desc'
                      : 'asc'
                    : ''
                  }
              >
                <span>
                  {column.render('Header')}
                  { column.Header === 'Print' 
                    || column.Header === 'View / Edit'
                    || isHomePreviewTable ? null
                    :column.isSorted
                    ? column.isSortedDesc
                    ? <DownArrowIcon />
                    : <UpArrowIcon />
                    : <SortIcon />
                  }
                </span>
              </th>
            ))}
          </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row,idx) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={uuidv4()}>
                {row.cells.map((cell, idx) => (
                  <td
                    {...cell.getCellProps()}
                    key={uuidv4()}
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
