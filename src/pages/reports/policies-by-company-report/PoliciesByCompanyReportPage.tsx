import Button from '@/components/Button/Button'
import FormInput from '@/components/Forms/Common/FormInput/FormInput'
import InfoCard from '@/components/InfoCard/InfoCard'
import Spinner from '@/components/Spinner/Spinner'
import { useCompaniesContext } from '@/context/Companies'
import { INSTitle } from '@/types/common'
import { timestampToDate } from '@/utils'
import formatNumber from '@/utils/formatNumber'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import styles from './PoliciesByCompanyReport.module.scss'

const PoliciesByCompanyReportPage = () => {

  const { companiesDropDownOptions, companyIdMap } = useCompaniesContext()

  const [reportData, setReportData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, sethasSearched] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [reportRunDate, setReportRunDate] = useState({
    start: '',
    end:''
  })

  const { 
    register, 
    handleSubmit,
    reset, 
    control,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      startDate: null,
      endDate: timestampToDate(Date.now(), 'yyyyMMdd').date,
      titleCompanyNumber: null
    }
  });

  const onSubmit = async(data:any) => {
    setCompanyName(companyIdMap[data.titleCompanyNumber])
    setReportRunDate({
      start: data.startDate,
      end: data.endDate
    })

    setIsLoading(true)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/post-policy-by-company-report`, data)

    const insTitleGroupedByCompany = response.data.reduce((acc: any, insTitle: INSTitle) => {
      type propKeyT = keyof typeof insTitle
      if (!acc[insTitle.tticoname as propKeyT]) {
        acc[insTitle.tticoname as propKeyT] = {titles: [], totalPremDue: 0}
      } 
      acc[insTitle.tticoname as keyof typeof insTitle].titles.push(insTitle)
      acc[insTitle.tticoname as keyof typeof insTitle].totalPremDue =  acc[insTitle.tticoname as keyof typeof insTitle].totalPremDue + insTitle.PREMDUE
      return acc
    },{})

    setReportData(insTitleGroupedByCompany)
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
      <div className='form-wrapper is-date-selection card-shadow light-border center-margin'>
        <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
          { companiesDropDownOptions && companiesDropDownOptions.length > 0 &&
            <Controller 
              name={"titleCompanyNumber"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="titleCompanyNumber"
                    labelKey="titleCompanyNumber"
                    labelText="Title Company Name"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={companiesDropDownOptions}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }
          <section className='date-inputs'>
            <FormInput 
              name="startDate"
              labelKey="startDate"
              labelText="Policy Start Date"
              type="date"
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="endDate"
              labelKey="endDate"
              labelText="Policy End Date"
              type="date"
              isRequired={true}
              register={register} 
              errors={errors}
            />
            <div>
              <Button isDisabled={!isDirty} type={'submit'} >
                Submit
              </Button>
            </div>
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
            <div ref={componentRef} className={`report-font ${styles['report-container']}`}>
              <h4>{`Title Insurance Policies for ${companyName}`}</h4>
              <h4>{timestampToDate(reportRunDate.start, 'mmDDyyyy').date} - {timestampToDate(reportRunDate.end, 'mmDDyyyy').date}</h4>
              <header>
                <div className={`flex-x gap-sm ${styles['header-span-group']}`}>
                  <span>Premium Date</span>
                  <span>Address</span>
                  <span>Condominium</span>
                </div>
                <div className={`flex-x gap-sm ${styles['header-span-group']}`}>
                  <span>Premium</span>
                  <span>Policy Number</span>
                  <span>Policy Amount</span>
                </div>
              </header>
              <section>
                { Object.keys(reportData).map(key => (
                    <div key={key} className={styles['company-policy-container']}>
                      <h5>{key}</h5>
                      { reportData[key as keyof typeof reportData].titles.map((policy: INSTitle, idx: number) => (
                          <div key={`${idx}-${policy.LPOLICYNUM }-${policy.OPOLICYNUM }`} className={styles['policy-list']}>
                            <div className={styles['col-1']}>
                              <span>{timestampToDate(policy.IPOLDATE,'mmDDyyyy').date}</span>
                              <span>{policy.PREMDUE ? `$${formatNumber(policy.PREMDUE)}` : '$0.00'}</span>
                            </div>
                            <div className={styles['col-2']}>
                              <span>{`${policy.ILOT} ${policy.ISTRET}, ${policy.ICITY}`}</span>
                              <div className={`flex-x gap-sm ${styles['span-group']}`}>
                                <span>Lenders: </span>
                                <span>{policy.LPOLICYAMT ? `$${formatNumber(policy.LPOLICYAMT)}` : '$0.00'}</span>
                                <span>{policy.LPOLICYNUM ? `#${policy.LPOLICYNUM}` : '# n/a'}</span>
                              </div>
                              <div className={`flex-x gap-sm ${styles['span-group']}`}>
                                <span>Owners: </span>
                                <span>{policy.OPOLICYAMT  ? `$${formatNumber(policy.OPOLICYAMT)}` : '$0.00'}</span>
                                <span>{policy.OPOLICYNUM ? `#${policy.OPOLICYNUM}` : '#n/a'}</span>
                              </div>
                              <div className='flex-x gap-sm'>
                                <span>Prepared for: </span>
                                <span>{policy.CNAME}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                      <footer className='flex-x gap-sm'>
                        <div className='flex-x gap-sm'>
                          <span>${formatNumber(reportData[key as keyof typeof reportData].totalPremDue)}</span>
                          <span>Gross Premium</span>
                        </div>
                        <div className='flex-x gap-sm'>
                          <span>{'$0.00'}</span>
                          <span>Net RLO Premium</span>
                        </div>
                        <div className='flex-x gap-sm'>
                          <span>{'$0.00'}</span>
                          <span>Net 724 Premium</span>
                        </div>
                        <div className='flex-x gap-sm'>
                          <span>{'$0.00'}</span>
                          <span>Net Title Co. Premium</span>
                        </div>
                      </footer>
                  </div>
                  )) 
                }
              </section>
            </div>
          </div>
        )
        : reportData && Object.keys(reportData).length === 0  && hasSearched
        ? <InfoCard line1='No results found.' />
        : <InfoCard line1='Select Client and Policy Date Range' line2='to Generate Report' />
      }
    </>
    
  )
}

export default PoliciesByCompanyReportPage