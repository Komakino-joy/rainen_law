import { PencilIcon } from '@/components/Icons/Icons';
import { Examiner, TableRefs } from '@/types/common';
import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';

interface ExaminersTableProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;

  setTableData: (
    tableData: Examiner[]
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
  handleModalOpen
}) => {
  
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
      }

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
