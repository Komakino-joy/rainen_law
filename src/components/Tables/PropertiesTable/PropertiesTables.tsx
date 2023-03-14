import { Property } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast'
import axios from 'axios';

import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { timestampToDate } from '@/utils';

import styles from './PropertiesTable.module.scss';

interface PropertiesTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, propId: string) => void;
  setTableData: (tableData: Property[]) => void;
}

const PropertiesTable:React.FC<PropertiesTableProps> = ({
  tableData,
  handleModalOpen,
  setTableData
}) => {

  const handleDelete = (e: React.SyntheticEvent, propId: string) => {
    e.preventDefault()

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async() => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/post-delete-property`, {propId})
            if(response.data.status = 'success') {
              toast.success(response.data.message, {id: 'delete-property'})

              const filteredArray = tableData.filter((row: Property) => row.PROPID !== propId);
              setTableData(filteredArray);
            }

            if(response.data.status = 'error') {
              toast.error(response.data.message, {id: 'delete-property'})
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'delete-property'
          })
        }
      ]
    });
  } 

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'PTDATE',
        accessor: (d:any) => timestampToDate(d.PTDATE, 'mmDDyyyy').date,
      },
      {
        Header: 'PCITY',
        accessor: (d:any) => `${d.PCITY}`,
      },
      {
        Header: 'PSTRET',
        accessor: (d:any) => `${d.PSTRET}`,
      },
      {
        Header: 'PLOT',
        accessor: (d:any) => `${d.PLOT}`,
      },
      {
        Header: 'PCONDO',
        accessor: (d:any) => d.PCONDO !== 'null' ? d.PCONDO : '',
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.PROPID,
        Cell: ({value}:{value:any}) => (
          <span
            title={`Edit Property: ${value}`} 
            onClick={(e) => handleModalOpen(e, value)}
          >
            <PencilIcon />
          </span>
        )
      },
      {
        Header: 'Delete',
        accessor: (d:any) => d.PROPID,
        Cell: ({value}:{value:any}) => (
          <span 
            title={`Delete Property: ${value}`} 
            onClick={(e) => handleDelete(e, value)}
          >
            <TrashIcon />
          </span>
        )
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
      //@ts-ignore
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      initialState: {}
    },
    useFilters, // useFilters!
  )

  return (
    <table {...getTableProps()} className={styles['properties-table']}>
      <thead>
        {headerGroups.map((headerGroup,idx) => (
        //@ts-ignore
        <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, idx) => (
            //@ts-ignore
            <th key={idx} {...column.getHeaderProps()} >
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
            <tr key={idx} {...row.getRowProps()}>
              {row.cells.map((cell, idx) => (
                <td
                  // @ts-ignore
                  key={idx}
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
