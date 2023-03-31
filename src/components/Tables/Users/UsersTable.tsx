import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { httpPostDeleteUser } from '@/services/http';
import { TableRefs, User } from '@/types/common';
import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';

interface UsersTableProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;

  setTableData: (
    tableData: User[]
  ) => void;

  handleModalOpen: (
    e: React.SyntheticEvent, 
    selectedRecordId: string, 
    tableRef:TableRefs | '', 
    formQueryType: 'insert'|'update'
  ) => void;
}

const UsersTable:React.FC<UsersTableProps> = ({
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
            const response = await httpPostDeleteUser({id, selectionType})
            if(response.data.status === 'success') {
              toast.success(response.data.message, {id: 'delete-user'})

              const filteredArray = tableData.filter((row) => row.id !== id);
              setTableData(filteredArray);
            }

            if(response.data.status === 'error') {
              toast.error(response.data.message, {id: 'delete-user'})
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'delete-user'
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
        accessor: (d:any) => d.id,
      },
      {
        Header: 'Username',
        accessor: (d:any) => d.username,
      },
      {
        Header: 'First Name',
        accessor: (d:any) => d.f_name,
      },
      {
        Header: 'Last Name',
        accessor: (d:any) => d.l_name,
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.id,
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

export default UsersTable
