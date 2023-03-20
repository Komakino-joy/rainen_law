import { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters } from 'react-table';
import axios from 'axios';

import { timestampToDate } from '@/utils';
import { PencilIcon } from '@/components/Icons/Icons';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import { useRouter } from 'next/router';

interface SubTablePropertiesProps {
  cnmbr: string
}

const SubTableProperties:React.FC<SubTablePropertiesProps> = ({
  cnmbr
}) => {
  const router = useRouter()

  const [tableData, setTableData] = useState([])
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPropId, setSelectedPropId] = useState<string|null>(null)
  const [shouldReload, setShouldReload] = useState(false)
  
  useEffect(() => {
    (async() => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/post-properties-info`, {CNMBR: cnmbr} )
      setTableData(response.data)
    })();
  },[])


  const handleModalClose = () => {
    setSelectedPropId(null)
    setShowModal(false)

    if(shouldReload) {
      router.reload()
    }
  }

  const handleAfterSubmit = (propId: string) => {
    setShouldReload(true)
  }


  const handleModalOpen =(e: React.SyntheticEvent, propId: string) => {
    e.preventDefault()
    setSelectedPropId(propId)
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
        accessor: (d:any) => timestampToDate(d.PTDATE, 'mmDDyyyy').date,
      },
      {
        Header: 'City',
        accessor: (d:any) => `${d.PCITY}`,
      },
      {
        Header: 'Street',
        accessor: (d:any) => `${d.PSTRET}`,
      },
      {
        Header: 'Lot',
        accessor: (d:any) => `${d.PLOT}`,
      },
      {
        Header: 'Condo',
        accessor: (d:any) => d.PCONDO !== 'null' ? d.PCONDO : '',
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.PROPID,
        Cell: ({value}:{value:any}) => (
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
      <table className='is-sub-report-table' {...getTableProps()}>
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
          selectedPropId={selectedPropId} 
          handleAfterSubmit={handleAfterSubmit} 
        />
        :null  
      }
    </>
  )
}

export default SubTableProperties
