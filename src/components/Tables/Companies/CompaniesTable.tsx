import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { ClientStatus, Company, County, InsStatus, PropertyStatus, PropertyType, TableRefs } from '@/types/common';
import axios from 'axios';
import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';

interface CompaniesTableProps {
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

const CompaniesTable:React.FC<CompaniesTableProps> = ({
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
            const response = await axios.post(`
              ${process.env.NEXT_PUBLIC_BASE_URL}/api/management/post-delete-select-drop-down-options`, 
              {id, selectionType}
            )
            if(response.data.status === 'success') {
              toast.success(response.data.message, {id: 'delete-select-drop-down-options'})

              const filteredArray = tableData.filter((row) => row.id !== id);
              setTableData(filteredArray);
            }

            if(response.data.status === 'error') {
              toast.error(response.data.message, {id: 'delete-select-drop-down-options'})
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'delete-select-drop-down-options'
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
        Header: 'Number',
        accessor: (d:any) => d.tnmbr,
      },
      {
        Header: 'Name',
        accessor: (d:any) => d.tticoname,
      },
      {
        Header: 'Abbr.',
        accessor: (d:any) => d.abbr,
      },
      {
        Header: 'Address',
        accessor: (d:any) => d.tadd1,
      },
      {
        Header: 'City',
        accessor: (d:any) => d.tcity,
      },
      {
        Header: 'State',
        accessor: (d:any) => d.tstate,
      },
      {
        Header: 'Zip Code',
        accessor: (d:any) => d.tzip,
      },
      {
        Header: 'Status',
        accessor: (d:any) => d.tstat,
      },
      {
        Header: 'Pct.',
        accessor: (d:any) => d.tpercent,
      },
      {
        Header: 'Prod1',
        accessor: (d:any) => d.tproduct1,
      },
      {
        Header: 'Prod2',
        accessor: (d:any) => d.tproduct2,
      },
      {
        Header: 'Prod3',
        accessor: (d:any) => d.tproduct3,
      },
      {
        Header: 'Prod4',
        accessor: (d:any) => d.tproduct4,
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

export default CompaniesTable
