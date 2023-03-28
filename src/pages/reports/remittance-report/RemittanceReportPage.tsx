import { INSTitle, RemittanceReportEntry } from '@/types/common'

import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'

import { RAINEN_LAW } from '@/constants'
import Button from '@/components/Button/Button'
import FormInput from '@/components/Forms/Common/FormInput/FormInput'
import InfoCard from '@/components/InfoCard/InfoCard'
import Spinner from '@/components/Spinner/Spinner'

import { useCompaniesContext } from '@/context/Companies'
import { timestampToDate } from '@/utils'
import formatNumber from '@/utils/formatNumber'

import styles from './RemittanceReport.module.scss'
import { httpPostRemmittanceReport } from '@/services/http'

const RemittanceReportPage = () => {

  const {companiesDropDownOptions} = useCompaniesContext()

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
      companyTnmbr: null
    }
  });

  const onSubmit = async(data:any) => {
    setIsLoading(true)
    const response = await httpPostRemmittanceReport({data})

    const groupedByCompany = response.data.reduce((acc: any, record: RemittanceReportEntry) => {
      type propKeyT = keyof typeof record
      if (!acc[record.tticoname as propKeyT]) {
        acc[record.tticoname as propKeyT] = {
          tadd1: '',
          tcity: '',
          tstate: '',
          tzip: '',
          titles: [], 
          totalPremDue: 0,
          totalPremPaid: 0,
          totalAgentFee: 0
        }
      } 

      acc[record.tticoname as keyof typeof record].tadd1 = record.tadd1
      acc[record.tticoname as keyof typeof record].tcity = record.tcity
      acc[record.tticoname as keyof typeof record].tstate = record.tstate
      acc[record.tticoname as keyof typeof record].tzip = record.tzip
      acc[record.tticoname as keyof typeof record].titles.push(record)
      acc[record.tticoname as keyof typeof record].totalPremDue =  acc[record.tticoname as keyof typeof record].totalPremDue + record.PREMDUE
      acc[record.tticoname as keyof typeof record].totalPremPaid =  acc[record.tticoname as keyof typeof record].totalPremPaid + record.PREMPAID
      acc[record.tticoname as keyof typeof record].totalAgentFee =  acc[record.tticoname as keyof typeof record].totalAgentFee + record.AGENTFEE
      return acc
    },{})

    setReportData(groupedByCompany)
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
          { companiesDropDownOptions && companiesDropDownOptions.length > 0 &&
            <Controller 
              name={"companyTnmbr"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="companyTnmbr"
                    labelKey="companyTnmbr"
                    labelText="Company Name"
                    type="select" 
                    customClass={styles['company-name-selection']}
                    selectOnChange={onChange}
                    options={[{
                        label: 'Select All *', 
                        value: '*'
                      }, 
                      ...companiesDropDownOptions
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
              className={`report-font ${styles['remittance-report-container']}`}
            >
                { Object.keys(reportData).map(key => {
    
                  const {
                    tadd1='',
                    tcity='',
                    tstate='',
                    tzip='',
                    totalPremDue=0,
                    totalPremPaid=0,
                    totalAgentFee=0
                  } = reportData[key]
                  
                  return(
                    <div key={key} className={styles['remittance-report-content']}>
                      <section>
                        <h4>{RAINEN_LAW.reportHeader.name}</h4>
                        <h5>{RAINEN_LAW.reportHeader.plaza}</h5>
                        <h5>{RAINEN_LAW.reportHeader.suite}</h5>
                        <h5>{RAINEN_LAW.reportHeader.cityStateZip}</h5>
                        <hr/>
                        <h4>{RAINEN_LAW.reportHeader.phone}</h4>
                        <h4>REPORT OF SUBMITTED POLICIES</h4>
                        <br/>
                        <header>
                          <p>{timestampToDate(Date(), 'mmDDyyyy').date}</p>
                          <p>{key}</p>
                          <p>{tadd1 || ''}</p>
                          <p>{`${tcity || ''} ${tstate || ''} ${tzip || ''}`}</p>
                        </header>
                        <div>
                          { reportData[key as keyof typeof reportData].titles.map((policy: INSTitle, idx: number) => {
                            const {
                              ILOT='',
                              ISTRET='',
                              ICITY='',
                              IFILE='',
                              LPOLICYNUM='',
                              LPOLICYAMT=0,
                              OPOLICYNUM='',
                              OPOLICYAMT=0,
                              PREMDUE=0,
                              AGENTFEE=0,
                              PREMPAID=0
                            } = policy
                            
                            return (
                              <div key={`${idx}-${policy.LPOLICYNUM }-${policy.OPOLICYNUM }`} className={styles['remittance-list']}>
                                <section className={styles['address-file-num-section']}>
                                  <span>{`Address: ${ILOT} ${ISTRET}, ${ICITY}`}</span>
                                  <span>{`Our File#: ${IFILE}`}</span>
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
                                <section className={styles['prem-agent-remit-section']}>
                                  <div>
                                    <span>Total Premium</span>
                                    <span>${PREMDUE ? formatNumber(PREMDUE) : '0.00'}</span>
                                  </div>
                                  <div>
                                    <span>Agents Portion</span>
                                    <span>${AGENTFEE ? formatNumber(AGENTFEE) : '0.00'}</span>
                                  </div>
                                  <div>
                                    <span>PREMIUM REMITTED</span>
                                    <span>${PREMPAID ? formatNumber(PREMPAID) : '0.00'}</span>
                                  </div>
                                </section>
                              </div>
                            )})
                          }
                          <footer className='page-break'>
                              <span>{`Total Premium Due: $${totalPremDue ? formatNumber(totalPremDue) : '0.00'}`}</span>
                              <span>{`Total Premium Remittance: $${totalPremPaid ? formatNumber(totalPremPaid) : '0.00'}`}</span>
                              <span>{`Agents Portion: $${totalAgentFee ? formatNumber(totalAgentFee) : '0.00'}`}</span>
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

export default RemittanceReportPage