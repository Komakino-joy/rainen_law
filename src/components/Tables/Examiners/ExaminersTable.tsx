import { PencilIcon } from '@/components/Icons/Icons';
import dbRef from '@/constants/dbRefs';
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
        accessor: (d:Examiner) => d[dbRef.examiners.id as keyof Examiner],
      },
      {
        Header: 'Name',
        accessor: (d:Examiner) => d[dbRef.examiners.name as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Code',
        accessor: (d:Examiner) => d[dbRef.examiners.code as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Type',
        accessor: (d:Examiner) => d[dbRef.examiners.type as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Compensation',
        accessor: (d:Examiner) => d[dbRef.examiners.compensate as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Is Active ?',
        accessor: (d:Examiner) => d[dbRef.examiners.is_active as keyof Examiner] || 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d:Examiner) => d[dbRef.examiners.id as keyof Examiner],
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
    [handleModalOpen, selectionType]
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
      initialState: {}
    },
    useFilters
  )

  return (
    <table className={`is-sub-table ${tableClassName}`} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup,idx) => (
        <tr {...headerGroup.getHeaderGroupProps()}  key={headerGroup.id}>
          {headerGroup.headers.map((column, idx) => (
            <th {...column.getHeaderProps()} key={column.id}>
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
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell, idx) => (
                <td
                  {...cell.getCellProps()}
                  key={cell.row.id}
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
