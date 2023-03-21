import { INSTitle } from '@/types/common';

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast'
import axios from 'axios';

import { PencilIcon, TrashIcon } from '@/components/Icons/Icons';
import { formatAddress, timestampToDate } from '@/utils';
import formatNumber from '@/utils/formatNumber';

interface InsTitlesTableProps {
  tableData: any;
  handleModalOpen: (e: React.SyntheticEvent, insTitleId: string) => void;
  setTableData: (tableData: INSTitle[]) => void;
}

const InsTitlesTable:React.FC<InsTitlesTableProps> = ({
  tableData,
  handleModalOpen,
  setTableData
}) => {

  const handleDelete = (e: React.SyntheticEvent, insTitleId: string) => {
    e.preventDefault()

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async() => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/titles/post-delete-ins-title`, {insTitleId})
            if(response.data.status = 'success') {
              toast.success(response.data.message, {id: 'delete-ins-title'})

              const filteredArray = tableData.filter((row: INSTitle) => row.id !== insTitleId);
              setTableData(filteredArray);
            }

            if(response.data.status = 'error') {
              toast.error(response.data.message, {id: 'delete-ins-title'})
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.error('Operation Cancelled.', {
            id: 'delete-ins-title'
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
        Header: 'File #',
        accessor: (d:any) => d.IFILE,
      },
      {
        Header: 'Bill #',
        accessor: (d:any) => d.IBILL,
      },
      {
        Header: 'Address',
        accessor: (d:any) => formatAddress({
          street: d.ISTRET,
          condo: d.ICONDO,
          unit: d.IUNIT,
          lot: d.ILOT
        }),
      },
      {
        Header: 'Client',
        accessor: (d:any) => d.CNAME,
      },
      {
        Header: 'Premium Due',
        accessor: (d:any) => `$${ d.PREMDUE ? formatNumber(d.PREMDUE) : '0.00'}`,
      },
      {
        Header: 'Premium Paid',
        accessor: (d:any) => `$${ d.PREMPAID ?formatNumber(d.PREMPAID) : '0.00'}`,
      },
      {
        Header: 'Date Billed',
        accessor: (d:any) => d.ICDATE ? timestampToDate(d.ICDATE, 'mmDDyyyy').date : 'n/a',
      },
      {
        Header: 'Policy Date',
        accessor: (d:any) => d.IPOLDATE ? timestampToDate(d.IPOLDATE, 'mmDDyyyy').date : 'n/a',
      },
      {
        Header: 'Notes',
        accessor: (d:any) => d.INOTES,
      },
      {
        Header: 'Date Paid',
        accessor: (d:any) => d.IPDATE ? timestampToDate(d.IPDATE, 'mmDDyyyy').date : 'n/a',
      },
      {
        Header: 'L Policy #',
        accessor: (d:any) => d.LPOLICYNUM,
      },
      {
        Header: 'O Policy #',
        accessor: (d:any) => d.OPOLICYNUM,
      },
      {
        Header: 'L Policy Amt',
        accessor: (d:any) => `$${ d.LPOLICYAMT ?formatNumber(d.LPOLICYAMT) : '0.00'}`,
      },
      {
        Header: 'O Policy Amt',
        accessor: (d:any) => `$${ d.OPOLICYAMT ?formatNumber(d.OPOLICYAMT) : '0.00'}`,
      },
      {
        Header: 'View / Edit',
        accessor: (d:any) => d.id,
        Cell: ({value}:{value:any}) => (
          <span
            title={`Edit Policy: ${value}`} 
            onClick={(e) => handleModalOpen(e, value)}
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
            title={`Delete Policy: ${value}`} 
            onClick={(e) => handleDelete(e, value)}
          >
            <TrashIcon />
          </span>
        )
      },
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
    <table className='is-all-ins-titles-table' {...getTableProps()}>
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

export default InsTitlesTable
