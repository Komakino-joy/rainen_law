import { ModalType, Property } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { PencilIcon } from '@/components/Icons/Icons';
import { timestampToDate } from '@/utils';
import PrintPropertyLabel from '@/components/PrintPropertyLabel/PrintPropertyLabel';

interface PropertiesTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, id: string, type: ModalType) => void;
  setTableData: (tableData: Property[]) => void;
  hiddenColumns?: string[];
}

const PropertiesTable:React.FC<PropertiesTableProps> = ({
  tableData,
  handleModalOpen,
  hiddenColumns=['']
}) => {

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
