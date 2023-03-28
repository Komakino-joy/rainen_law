import { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';

import { timestampToDate } from '@/utils';
import { PencilIcon } from '@/components/Icons/Icons';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import { useRouter } from 'next/router';
import { Property } from '@/types/common';
import { httpPostPropertiesInfo } from '@/services/http';

interface SubTablePropertiesProps {
  cnmbr: string
}

const SubTableProperties:React.FC<SubTablePropertiesProps> = ({
  cnmbr
}) => {
  const router = useRouter()

  const [tableData, setTableData] = useState([])
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  useEffect(() => {
    (async() => {
      const propertiesInfo = await httpPostPropertiesInfo({cnmbr})
      setTableData(propertiesInfo)
    })();
  },[])


  const handleModalClose = () => {
    setSelectedId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (id: string) => {
    setShouldReload(true)
  }


  const handleModalOpen =(e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    setSelectedId(id)
    setShowModal(true)
  }

  const data = useMemo(() => (
    tableData
    ), [tableData]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: (d:Property) => timestampToDate(d.PTDATE, 'mmDDyyyy').date,
      },
      {
        Header: 'City',
        accessor: (d:Property) => d.PCITY  || 'N/A',
      },
      {
        Header: 'Street',
        accessor: (d:Property) => d.PSTRET || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d:Property) => d.PLOT || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d:Property) => d.PCONDO !== 'null' ? d.PCONDO : 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d:Property) => d.id,
        Cell: ({value}:{value:string}) => (
          <span
            title={`Edit Property: ${value}`} 
            onClick={(e) => handleModalOpen(e, value)}
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
    <>
      <table className='is-sub-table' {...getTableProps()}>
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
      { showModal ? 
        <EditPropertyModal 
          handleModalClose={handleModalClose} 
          showModal={showModal} 
          title={''}
          selectedId={selectedId} 
          handleAfterSubmit={handleAfterSubmit} 
        />
        :null  
      }
    </>
  )
}

export default SubTableProperties
