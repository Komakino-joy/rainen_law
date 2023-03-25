import { ClientStatus, Company, County, InsStatus, PropertyStatus, PropertyType, TableRefs } from '@/types/common'
import React, { useState } from 'react'
import { useUsersContext } from '@/context/Users'
import { useCompaniesContext } from '@/context/Companies'
import { useExaminersContext } from '@/context/Examiners'
import { useSelectDropDownsContext } from '@/context/SelectDropDowns'
import EditUserForm from '../Forms/UserEditForm/EditUserForm'
import EditCompanyForm from '../Forms/CompanyEditForm/EditCompanyForm'
import EditExaminerForm from '../Forms/ExaminerEditForm/EditExaminerForm'
import EditStatusCodeForm from '../Forms/StatusCodeEditForm/EditStatusCodeForm'
import DynamicTable from '../Tables/Dynamic/DynamicTable'
import UsersTable from '../Tables/Users/UsersTable'
import CompaniesTable from '../Tables/Companies/CompaniesTable'
import ExaminersTable from '../Tables/Examiners/ExaminersTable'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'
import InfoCard from '../InfoCard/InfoCard'
import { PencilIcon, PlusCircleIcon } from '../Icons/Icons'
import styles from './ManagementCard.module.scss'

const ManageSelectionFieldsCard = () => {

  const {companiesList , isLoadingCompaniescontext} = useCompaniesContext()
  const {examinersList, isLoadingExaminerscontext} = useExaminersContext()
  const {usersList, isLoadingUserscontext} = useUsersContext()
  const {
    isLoadingSelectDropDownsContext,
    clientStatusList,
    insStatusList,
    propertyStatusList,
    propertyTypeList,
    countyList
  } = useSelectDropDownsContext()

  const isLoading = 
    isLoadingCompaniescontext 
    || isLoadingExaminerscontext
    || isLoadingUserscontext
    || isLoadingSelectDropDownsContext

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectionType, setSelectionType] = useState<TableRefs | ''>('')
  const [queryType, setQueryType] = useState<'insert' | 'update'>('insert')
  const [selectedItemId, setSelectedItemId] = useState<string|null>(null)
  const [tableData, setTableData] = useState<Company[] | County[] | PropertyType[] | PropertyStatus[] | ClientStatus[] | InsStatus[]>([])

  const editableFields = [
    {label: 'Users', tableRef: 'users'},
    {label: 'Examiners', tableRef: 'examiners'},
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
      case 'users':
        setSelectionType('users')
        setTableData(usersList)
        break;
      case 'examiners':
        setSelectionType('examiners')
        setTableData(examinersList)
        break;
      case 'companies':
        setSelectionType('companies')
        setTableData(companiesList)
        break;
      case 'counties':
        setSelectionType('counties')
        setTableData(countyList)
        break;
      case 'pType':
        setSelectionType('pType')
        setTableData(propertyTypeList)
        break;
      case 'pStat':
        setSelectionType('pStat')
        setTableData(propertyStatusList)
        break;
      case 'clientStat':
        setSelectionType('clientStat')
        setTableData(clientStatusList)
        break;
      case 'insTitleStat':
        setSelectionType('insTitleStat')
        setTableData(insStatusList)
        break;
      default:
        break;
    }
  }

  const handleModalOpen =(e: React.SyntheticEvent, selectedRecordId: string, tableRef:TableRefs | '', formQueryType: 'insert'|'update') => {
    e.preventDefault()
    
    setQueryType(formQueryType)
    setSelectedItemId(selectedRecordId)

    switch(tableRef) {
      case 'users':
        setSelectionType('users')
        break;
      case 'examiners':
        setSelectionType('examiners')
        break;
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
    setSelectedItemId(null)
    setShowModal(false)
  }

  if(isLoading) {
    return <div className='page-spinner'><Spinner/></div>
  }

  const hasData = tableData.length > 0

  const isCompanyTable = selectionType === 'companies'
  const isExaminersTable = selectionType === 'examiners'
  const isUsersTable = selectionType === 'users'
  const isDynamicTable = 
    selectionType ===  'counties' 
    || selectionType === 'pType' 
    || selectionType === 'pStat' 
    || selectionType === 'clientStat' 
    || selectionType === 'insTitleStat' 

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
            <header>
              <span 
                onClick={(e) => handleModalOpen(e, '', selectionType, 'insert')}
                className={styles['add-new-button']}
              >
              <PlusCircleIcon/> Add New
              </span>
              <span className={styles['table-title']}>{editableFields.find(field => field.tableRef === selectionType)?.label}</span>
            </header>
            { hasData && isDynamicTable ?
                <div className={styles['table-container']}>
                  <DynamicTable 
                    tableData={tableData} 
                    selectionType={selectionType}
                    tableClassName={styles[selectionType]}
                    setTableData={setTableData}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              : hasData && isCompanyTable ?
                <div className={styles['table-container']}>
                  <CompaniesTable 
                    tableData={tableData} 
                    selectionType={selectionType}
                    tableClassName={styles[selectionType]}
                    setTableData={setTableData}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              : hasData && isExaminersTable ?
                <div className={styles['table-container']}>
                  <ExaminersTable 
                    tableData={tableData} 
                    selectionType={selectionType}
                    tableClassName={styles[selectionType]}
                    setTableData={setTableData}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              : hasData && isUsersTable ?
                <div className={styles['table-container']}>
                  <UsersTable 
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
        { isDynamicTable && hasData ?
          <EditStatusCodeForm 
            tableData={tableData}
            setTableData={setTableData}
            selectionType={selectionType}
            selectedStatusCodeItemId={selectedItemId} 
            queryType={queryType}
          /> : null
        }
        { isCompanyTable && hasData ?
          <EditCompanyForm 
            tableData={tableData}
            setTableData={setTableData}
            selectedId={selectedItemId} 
            queryType={queryType}
          /> : null
        }
        { isExaminersTable && hasData ?
          <EditExaminerForm 
            tableData={tableData}
            setTableData={setTableData}
            selectedId={selectedItemId} 
            queryType={queryType}
          /> : null
        }
        { isUsersTable && hasData ?
          <EditUserForm 
            tableData={tableData}
            setTableData={setTableData}
            selectedId={selectedItemId} 
            queryType={queryType}
          /> : null
        }
      </Modal>
    </>
  )
}

export default ManageSelectionFieldsCard