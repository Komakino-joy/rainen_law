import { ClientStatus, Company, County, InsStatus, PropertyStatus, PropertyType, TableRefs } from '@/types/common'
import { useSelectDropDownsContext } from '@/context/SelectDropDowns'
import React, { useState } from 'react'
import { PencilIcon, PlusCircleIcon } from '../Icons/Icons'
import InfoCard from '../InfoCard/InfoCard'
import Spinner from '../Spinner/Spinner'
import SelectOptionsTable from '../Tables/SelectOptions/SelectOptionsTable'
import styles from './ManageSelectionFieldsCard.module.scss'
import Modal from '../Modal/Modal'
import EditStatusCodeForm from '../Forms/StatusCodeEditForm/EditStatusCodeForm'

const ManageSelectionFieldsCard = () => {

  const {
    isLoadingSelectDropDownsContext,
    clientStatusOptions,
    insStatusOptions,
    propertyStatusOptions,
    propertyTypeOptions,
    countyOptions,
    companyOptions
  } = useSelectDropDownsContext()


  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectionType, setSelectionType] = useState<TableRefs | ''>('')
  const [queryType, setQueryType] = useState<'insert' | 'update'>('insert')
  const [selectedStatusCodeItemId, setSelectedStatusCodeItemId] = useState<string|null>(null)
  const [tableData, setTableData] = useState<Company[] | County[] | PropertyType[] | PropertyStatus[] | ClientStatus[] | InsStatus[]>([])

  const editableFields = [
    {label: 'Companies', tableRef: 'companies'},
    {label: 'Counties', tableRef: 'counties'},
    {label: 'Property Type', tableRef: 'pType'},
    {label: 'Property Status', tableRef: 'pStat'},
    {label: 'Client Status', tableRef: 'clientStat'},
    {label: 'Ins. Title Status', tableRef: 'insTitleStat'},
  ]

  
  const handleEditButtonClick = (e:any, tableRef:TableRefs) => {
    e.preventDefault()
    switch (tableRef) {
      case 'companies':
        setSelectionType('companies')
        setTableData(companyOptions)
        break;
      case 'counties':
        setSelectionType('counties')
        setTableData(countyOptions)
        break;
      case 'pType':
        setSelectionType('pType')
        setTableData(propertyTypeOptions)
        break;
      case 'pStat':
        setSelectionType('pStat')
        setTableData(propertyStatusOptions)
        break;
      case 'clientStat':
        setSelectionType('clientStat')
        setTableData(clientStatusOptions)
        break;
      case 'insTitleStat':
        setSelectionType('insTitleStat')
        setTableData(insStatusOptions)
        break;
      default:
        break;
    }
  }

  const handleModalOpen =(e: React.SyntheticEvent, selectedRecordId: string, tableRef:TableRefs | '', formQueryType: 'insert'|'update') => {
    e.preventDefault()
    
    setQueryType(formQueryType)
    setSelectedStatusCodeItemId(selectedRecordId)

    switch(tableRef) {
      case 'companies':
        setSelectionType('companies')
        break;
      case 'counties':
        setSelectionType('counties')
        break;
      case 'pType':
        setSelectionType('pType')
        break;
      case 'pStat':
        setSelectionType('pStat')
        break;
      case 'clientStat':
        setSelectionType('clientStat')
        break;
      case 'insTitleStat':
        setSelectionType('insTitleStat')
        break;
      default:
        break
    }
    setShowModal(true)
  }

  const handleModalClose = () => {
    setSelectedStatusCodeItemId(null)
    setShowModal(false)
  }

  if(isLoadingSelectDropDownsContext) {
    return <div className='page-spinner'><Spinner/></div>
  }

  const hasData = tableData.length > 0

  return (
    <>
      <h3>Manage Selection Fields</h3>
      <div className={`light-border ${styles['card']}`}>
        <div className={styles['content']}>
          <section className={styles['edit-options-section']}>
            {editableFields.map(field => (
              <div 
                key={field.label} 
                className={`
                  ${styles['edit-button']}
                  ${selectionType === field.tableRef ? styles.selected : ''}  
                `}
                onClick={(e) => handleEditButtonClick(e, field.tableRef as TableRefs)}
              >
                <span>{field.label}</span>
                <PencilIcon/>
              </div>
            ))}
          </section>
          <section className={`
            ${styles['table-section']}
            ${hasData ? styles['has-data'] : ''}
          `}>
            <span 
              onClick={(e) => handleModalOpen(e, '', selectionType, 'insert')}
              className={styles['add-new-button']}
            >
              Add new <PlusCircleIcon/>
            </span>
            { hasData ?
                <div className={styles['table-container']}>
                  <SelectOptionsTable 
                    tableData={tableData} 
                    selectionType={selectionType}
                    tableClassName={styles[selectionType]}
                    setTableData={setTableData}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              : <InfoCard line1='Select a field to get started' />
            }
          </section>
        </div>
      </div>
      <Modal
        onClose={handleModalClose}
        show={showModal}
        title={''}
      >
        { selectionType !== 'companies' && hasData ?
          <EditStatusCodeForm 
            tableData={tableData}
            setTableData={setTableData}
            selectionType={selectionType}
            selectedStatusCodeItemId={selectedStatusCodeItemId} 
            queryType={queryType}
            handleAfterSubmit={() => {}}
          /> : null
        }
        {/* 
        }
        { selectedClientId && 
          <EditClientForm 
            clientId={selectedClientId}
            queryType='update'
            handleAfterSubmit={() => {}}
          />
        }
        { selectedInsTitleId && 
          <EditINSForm 
            insTitleId={selectedInsTitleId}
            queryType='update'
            handleAfterSubmit={() => {}}
          />
        } */}
      </Modal>
    </>
  )
}

export default ManageSelectionFieldsCard