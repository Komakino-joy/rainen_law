import { ModalType, Property } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast'

import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { timestampToDate } from '@/utils';
import PrintPropertyLabel from '@/components/PrintPropertyLabel/PrintPropertyLabel';
import { httpPostDeleteProperty } from '@/services/http';

interface PropertiesTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, id: string, type: ModalType) => void;
  setTableData: (tableData: Property[]) => void;
  hiddenColumns?: string[];
}

const PropertiesTable:React.FC<PropertiesTableProps> = ({
  tableData,
  handleModalOpen,
  setTableData,
  hiddenColumns=['']
}) => {

  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async() => {
            const response = await httpPostDeleteProperty({id})
            if(response.data.status === 'success') {
              toast.success(response.data.message, {id: 'delete-property'})

              const filteredArray = tableData.filter((row: Property) => row.id !== id);
              setTableData(filteredArray);
            }

            if(response.data.status === 'error') {
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
        Header: 'PT Date',
        accessor: (d:Property) => timestampToDate(d.PTDATE, 'mmDDyyyy').date,
      },
      {
        Header: 'City',
        accessor: (d:Property) => `${d.PCITY}` || 'N/A',
      },
      {
        Header: 'Street',
        accessor: (d:Property) => `${d.PSTRET}` || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d:Property) => `${d.PLOT}` || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d:Property) => d.PCONDO !== 'null' ? d.PCONDO : 'N/A',
      },
      {
        Header: 'Print',
        accessor: (d:Property) => d,
        Cell: ({value}:{value:any}) => (
          <span 
          title={`Print Property: ${value.id}`} 
          >
            <PrintPropertyLabel 
              usePrinterIcon={true}
              propertyInfo={value}
            />
          </span>
        )
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.id,
        Cell: ({value}:{value:any}) => (
          <span
            title={`Edit Property: ${value}`} 
            onClick={(e) => handleModalOpen(e, value, 'property')}
          >
            <PencilIcon />
          </span>
        )
      },
      {
        Header: 'Delete',
        accessor: (d:any) => d.id,
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
  } = useTable({
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
    <table {...getTableProps()}>
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

export default PropertiesTable
