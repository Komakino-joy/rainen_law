import { OutstandingInsTitleReportEntry } from '@/types/common'

import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'

import { RAINEN_LAW } from '@/constants'
import Button from '@/components/Button/Button'
import FormInput from '@/components/Forms/Common/FormInput/FormInput'
import InfoCard from '@/components/InfoCard/InfoCard'
import Spinner from '@/components/Spinner/Spinner'

import { useClientsContext } from '@/context/Clients'
import { timestampToDate } from '@/utils'
import formatNumber from '@/utils/formatNumber'

import styles from './OutStandingPremReport.module.scss'
import { httpPostOutstandingInsTitlePremReport } from '@/services/http'

const OutStandingPremReportPage = () => {

  const {clientSelectOptions} = useClientsContext()
  const {CNAME: clientNames} = clientSelectOptions

  const [reportData, setReportData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, sethasSearched] = useState(false)

  const { 
    register, 
    handleSubmit,
    reset, 
    control,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      clientName: null
    }
  });

  const onSubmit = async(data:any) => {
    setIsLoading(true)
    const response = await httpPostOutstandingInsTitlePremReport({data})
    const goupedByCLient = response.data.reduce((acc: any, record: OutstandingInsTitleReportEntry) => {
      type recordKey = keyof typeof record

      if (!acc[record.CNAME as recordKey]) {
        acc[record.CNAME as recordKey] = {
          clientContact: '',
          clientName: '',
          clientAddress1: '',
          clientAddress2: '',
          clientCity: '',
          clientState: '',
          clientZip: '',
          titles: []
        }
      } 
      
      acc[record.CNAME as recordKey].clientContact = record.CCNTCT
      acc[record.CNAME as recordKey].clientName = record.CNAME
      acc[record.CNAME as recordKey].clientAddress1 = record.CADD1
      acc[record.CNAME as recordKey].clientAddress2 = record.CADD2
      acc[record.CNAME as recordKey].clientCity = record.CCITY
      acc[record.CNAME as recordKey].clientState = record.CSTATE
      acc[record.CNAME as recordKey].clientZip = record.CZIP
      acc[record.CNAME as recordKey].titles.push(record)
      return acc
    },{})
    setReportData(goupedByCLient)
    setIsLoading(false)
    sethasSearched(true)
    reset()
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getPageMargins = () => {
    return `@page { margin: 10px 20px !important; }`;
  };

  return (
    <>
      <div className='form-wrapper card-shadow light-border center-margin'>
        <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
          { clientNames && clientNames.length > 0 &&
            <Controller 
              name={"clientName"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="clientName"
                    labelKey="clientName"
                    labelText="Client Name"
                    type="select" 
                    customClass={styles['client-name-selection']}
                    selectOnChange={onChange}
                    options={[{
                        label: 'Select All *', 
                        value: '*'
                      }, 
                      ...clientNames
                    ]}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }
          <section className={styles['submit-button-section']}>
            <Button isDisabled={!isDirty} type={'submit'} >
              Submit
            </Button>
          </section>
        </form>
      </div>

      { isLoading ? <div className='page-spinner'><Spinner/></div>
        : reportData && Object.keys(reportData).length > 0 ?
        (
          <div className={styles['report-page-wrapper']}>
            <style>{getPageMargins()}</style>
            <Button 
              onClick={handlePrint} 
              isDisabled={false} 
              type={'button'}
              customClass={styles['print-report-button']}
            >
              Print Report
            </Button>
            <div 
              ref={componentRef} 
              className={`report-font ${styles['outstanding-ins-report-container']}`}
            >
                { Object.keys(reportData).map(key => {
    
                  const {
                    clientContact= '',
                    clientName='',
                    clientAddress1='',
                    clientAddress2='',
                    clientCity='',
                    cleintState='',
                    clientZip='',
                    titles= []
                  } = reportData[key]
                  
                  return(
                    <div key={key} className={styles['outstanding-ins-report-content']}>
                      <section>
                        <h4>{RAINEN_LAW.reportHeader.name}</h4>
                        <h5>{RAINEN_LAW.reportHeader.plaza}</h5>
                        <h5>{RAINEN_LAW.reportHeader.suite}</h5>
                        <h5>{RAINEN_LAW.reportHeader.cityStateZip}</h5>
                        <hr/>
                        <h4>{RAINEN_LAW.reportHeader.phone}</h4>
                        <h4>OUTSTANDING TITLE INSURANCE PREMIUMS</h4>
                        <h5>{timestampToDate(Date(), 'mmDDyyyy').date}</h5>
                        <br/>
                        <header>
                          <p>{clientContact}</p>
                          <p>{clientName}</p>
                          <p>{clientAddress1 || ''}</p>
                          <p>{clientAddress2 || ''}</p>
                          <p>{`${clientCity || ''} ${cleintState || ''} ${clientZip || ''}`}</p>
                        </header>
                        <div>
                          { titles.map((policy: OutstandingInsTitleReportEntry, idx: number) => {
                            const {
                              IBILL=0,
                              ICITY='',
                              IFILE=0,
                              ILOT='',
                              IPOLDATE='',
                              ISTRET='',
                              LPOLICYNUM='',
                              LPOLICYAMT=0,
                              OPOLICYNUM='',
                              OPOLICYAMT=0,
                              PREMDUE=0
                            } = policy
                            
                            return (
                              <div key={`${idx}-${policy.LPOLICYNUM }-${policy.OPOLICYNUM }`} className={styles['outstanding-ins-list']}>
                                <section className={styles['address-bill-num-section']}>
                                  <span>{`Address: ${ILOT} ${ISTRET}, ${ICITY}`}</span>
                                  <span>{`Bill#: ${IBILL || 'n/a'}`}</span>
                                </section>
                                <section className={styles['policy-details-section']}>
                                  <div className={styles['col-1-a']}>
                                    <span>{`Loan Policy#: ${LPOLICYNUM || 'n/a'}`}</span>
                                    <span>{`Owner's Policy#: ${OPOLICYNUM || 'n/a'}`}</span>
                                  </div>
                                  <div className={styles['col-2-a']}>
                                    <span>{`Policy Amount: $${LPOLICYAMT ? formatNumber(LPOLICYAMT) : '0.00'}`}</span>
                                    <span>{`Policy Amount: $${OPOLICYAMT ? formatNumber(OPOLICYAMT) : '0.00'}`}</span>
                                  </div>
                                </section>
                                <section className={styles['file-policy-premdue-section']}>
                                    <span>{`File#: ${IFILE.toFixed() || 'n/a'}`}</span>
                                    <span>{`Policy Issued: ${IPOLDATE ? timestampToDate(IPOLDATE, 'mmDDyyyy').date : 'n/a'}`}</span>
                                </section>
                                <span>{`PREMIUM DUE: $${PREMDUE ? formatNumber(PREMDUE) : '0.00'}`}</span>
                              </div>
                            )})
                          }
                          <footer className='page-break' >
                            <p>
                              PLEASE NOTE THAT THE ABOVE REFERENCED {titles.length > 1 ? 'POLICIES' : 'POLICY'}
                              <br/>
                              {titles.length > 1 ? 'DO' : 'DOES'} NOT BECOME EFFECTIVE UNTIL ALL PREMIUMS ARE REMITTED
                            </p>
                          </footer>
                        </div>
                      </section>
                    </div>
                  )}) 
                }
            </div>
          </div>
        )
        : reportData && Object.keys(reportData).length === 0 && hasSearched
        ? <InfoCard line1='No results found' />
        : <InfoCard line1='Select Company Name' line2='to Generate Report' />
      }

    </>
    
  )
}

export default OutStandingPremReportPage