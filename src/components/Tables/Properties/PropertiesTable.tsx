import { ModalType, Property } from '@/types/common';

import { useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';

import { PencilIcon } from '@/components/Icons/Icons';
import { timestampToDate } from '@/utils';
import PrintPropertyMultiple from '@/components/PrintPropertyMultiple/PrintPropertyMultiple';

import styles from './PropertiesTable.module.scss'

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
  
  const [labelsToPrint, setLabelsToPrint] = useState<Property[]>([])

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'PT Date',
        accessor: (d:Property) => timestampToDate(d.p_input_date, 'mmDDyyyy').date,
      },
      {
        Header: 'City',
        accessor: (d:Property) => `${d.p_city}` || 'N/A',
      },
      {
        Header: 'Street',
        accessor: (d:Property) => `${d.p_street}` || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d:Property) => `${d.p_lot}` || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d:Property) => d.p_condo !== 'null' ? d.p_condo : 'N/A',
      },
      {
        Header: 'Print',
        accessor: (d:Property) => d,
        Cell: ({value}:{value:any}) => (
          <input
            name={`property-${value.id}`}
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
                  const filteredArray = prevState.filter(property => (
                    property.id !== value.id
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
    <div className={styles.container}>
      { labelsToPrint.length > 0 &&
        <div className={styles['button-container']}>
          <PrintPropertyMultiple properties={labelsToPrint}>
            {`Print ${labelsToPrint.length} ${labelsToPrint.length === 1 ? 'Label' : 'Labels'}`}
          </PrintPropertyMultiple>
        </div>
      }
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
    </div>
  )
}

export default PropertiesTable
