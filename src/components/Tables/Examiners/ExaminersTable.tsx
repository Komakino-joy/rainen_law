import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { httpPostDeleteExaminer } from '@/services/http';
import { ClientStatus, Company, County, Examiner, InsStatus, PropertyStatus, PropertyType, TableRefs } from '@/types/common';
import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';

interface ExaminersTableProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;

  setTableData: (
    tableData: Company[] 
    | County[] 
    | PropertyType[] 
    | PropertyStatus[] 
    | ClientStatus[] 
    | InsStatus[]
  ) => void;

  handleModalOpen: (
    e: React.SyntheticEvent, 
    selectedRecordId: string, 
    tableRef:TableRefs | '', 
    formQueryType: 'insert'|'update'
  ) => void;
}

const ExaminersTable:React.FC<ExaminersTableProps> = ({
  tableData,
  selectionType,
  tableClassName,
  setTableData,
  handleModalOpen
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
            const response = await httpPostDeleteExaminer({id, selectionType})
            if(response.data.status === 'success') {
              toast.success(response.data.message, {id: 'delete-examiner'})

              const filteredArray = tableData.filter((row) => row.id !== id);
              setTableData(filteredArray);
            }

            if(response.data.status === 'error') {
              toast.error(response.data.message, {id: 'delete-examiner'})
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'delete-examiner'
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
        Header: 'ID',
        accessor: (d:Examiner) => d.id,
      },
      {
        Header: 'Name',
        accessor: (d:Examiner) => d.name || 'N/A',
      },
      {
        Header: 'Code',
        accessor: (d:Examiner) => d.code || 'N/A',
      },
      {
        Header: 'Type',
        accessor: (d:Examiner) => d.type || 'N/A',
      },
      {
        Header: 'Compensation',
        accessor: (d:Examiner) => d.compensate || 'N/A',
      },
      {
        Header: 'Is Active ?',
        accessor: (d:Examiner) => d.is_active || 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d:Examiner) => d.id,
        Cell: ({value}:{value:any}) => (
          <span
            title={`Edit ${selectionType}: ${value}`} 
            onClick={(e) => handleModalOpen(e, value, selectionType, 'update')}
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
            title={`Delete  ${selectionType}: ${value}`} 
            onClick={(e) => handleDelete(e, value)}
          >
            <TrashIcon />
          </span>
        )
      },

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
    <table className={`is-sub-table ${tableClassName}`} {...getTableProps()}>
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

export default ExaminersTable
