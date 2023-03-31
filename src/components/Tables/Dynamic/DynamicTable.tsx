import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { httpPostDeleteSelectDropDownOptions } from '@/services/http';
import { ClientStatus, County, Examiner, PropertyStatus, PropertyType, TableRefs } from '@/types/common';
import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';

interface DynamicTable {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;

  setTableData: (
    tableData: 
      County[] 
    | PropertyType[] 
    | PropertyStatus[] 
    | ClientStatus[] 
    | Examiner[]
  ) => void;

  handleModalOpen: (
    e: React.SyntheticEvent, 
    selectedRecordId: string, 
    tableRef:TableRefs | '', 
    formQueryType: 'insert'|'update'
  ) => void;
}

type HiddenColumnsT = (
  'Status Code' 
  | 'Status Description' 
  | 'Type Code' 
  | 'Type Description'
  // County Specific Fields
  | 'County Code'
  | 'County Name'
  )[];

const SelectOptionsTable:React.FC<DynamicTable> = ({
  tableData,
  selectionType,
  tableClassName,
  setTableData,
  handleModalOpen
}) => {

  let hiddenColumns:HiddenColumnsT = []

  //  Conditionally hide unrelated columns when passing in table data
  switch (selectionType) {
    case 'pStat':
    case 'clientStat':
      hiddenColumns = ['Type Code','Type Description','County Code','County Name']
      break;

    case 'pType':
      hiddenColumns = ['Status Code','Status Description','County Code','County Name']
      break;


    case 'counties':
      hiddenColumns = ['Type Code','Type Description', 'Status Code','Status Description']
      break;

    default:
      break;
  }

  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async() => {
            const response = await httpPostDeleteSelectDropDownOptions({id, selectionType})
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
        Header: 'Status Code',
        accessor: (d:any) => d.status_code,
      },
      {
        Header: 'Status Description',
        accessor: (d:any) => d.status_desc,
      },
      {
        Header: 'Type Code',
        accessor: (d:any) => d.type_code,
      },
      {
        Header: 'Type Description',
        accessor: (d:any) => d.type_desc,
      },
      //  County specific columns, should be hidden if not viewing County
      {
        Header: 'County Code',
        accessor: (d:any) => d.code,
      },
      {
        Header: 'County Name',
        accessor: (d:any) => d.county,
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
      initialState: {
        hiddenColumns
      }
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

export default SelectOptionsTable
