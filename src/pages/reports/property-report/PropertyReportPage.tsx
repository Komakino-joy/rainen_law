'use client';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import FormInput from '@/components/Forms/Common/FormInput/FormInput';
import Button from '@/components/Button/Button';
import styles from './PropertyReport.module.scss'
import { timestampToDate } from '@/utils';
import { Property, ReportProperty } from '@/types/common';
import ReportProperties from '@/components/Tables/ReportProperties/ReportProperties';
import InfoCard from '@/components/InfoCard/InfoCard';
import RegistryOfDeedsBreakDown from '@/components/RegistryOfDeedsBreakDown/RegistryOfDeedsBreakDown';
import TitlesBreakDown from '@/components/TitleBreakDown/TitlesBreakDown';
import { useReactToPrint } from 'react-to-print';
import Spinner from '@/components/Spinner/Spinner';
import { httpPostPropertyReport } from '@/services/http';

export default function PropertyReport() {
  
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, sethasSearched] = useState(false)
  const [propertiesData, setPropertiesData] = useState<Property[] | null>(null)
  const [countyCountMap, setCountyCountMap] = useState({})
  const [titleTypeMap, setTitleTypeMap] = useState({})
  const [reportRunDate, setReportRunDate] = useState({
    start: '',
    end:''
  })

  const { 
    register, 
    handleSubmit,
    reset, 
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      startDate: null,
      endDate: timestampToDate(Date.now(), 'yyyyMMdd').date
    }
  });

  const onSubmit = async(data:any) => {
    setIsLoading(true)
    setReportRunDate({
      start: data.startDate,
      end: data.endDate
    })

    const response = await httpPostPropertyReport({data})
    setPropertiesData(response.data)

    setCountyCountMap(response.data.reduce((acc: any, propObj: ReportProperty) => {
      if(!acc[propObj.county_name]) {
        acc[propObj.county_name] = 1
      } else {
        acc[propObj.county_name] = acc[propObj.county_name] + 1
      }
      return acc
    }, {}))

    setTitleTypeMap(response.data.reduce((acc: any, propObj: ReportProperty) => {
      if(!acc[propObj.p_type]) {
        acc[propObj.p_type] = 1
      } else {
        acc[propObj.p_type] = acc[propObj.p_type] + 1
      }
      return acc
    }, {}))

    reset()
    setIsLoading(false)
    sethasSearched(true)
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getPageMargins = () => {
    return `@page { margin: 10px 20px !important; }`;
  };

  return (
    <div className={`flex-y gap-md ${styles['property-page-content'] }`}>
      <div className='form-wrapper is-date-selection card-shadow light-border center-margin'>
        <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
          <section className='date-inputs'>
            <FormInput 
              name="startDate"
              labelKey="startDate"
              labelText="Start Date"
              type="date"
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="endDate"
              labelKey="endDate"
              labelText="End Date"
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
        : propertiesData && propertiesData.length > 0 ?
        <div className={styles['property-report-wrapper']} >
          <style>{getPageMargins()}</style>
            <Button 
              onClick={handlePrint} 
              isDisabled={false} 
              type={'button'}
              customClass={styles['print-report-button']}
            >
              Print Report
            </Button>
          <div ref={componentRef} className={styles['property-report-printable-area']}>
            <header>
              <p>Property Report</p>
              <span>{timestampToDate(reportRunDate.start, 'mmDDyyyy').date} - {timestampToDate(reportRunDate.end, 'mmDDyyyy').date}</span>
            </header>

            <ReportProperties tableData={propertiesData} />
            <span className={styles.total}>Total Projects On Order: {propertiesData.length}</span>

            <TitlesBreakDown 
              totalRecords={propertiesData.length}            
              titleTypeMap={titleTypeMap} 
            />

            <RegistryOfDeedsBreakDown 
              totalRecords={propertiesData.length}
              countyCountMap={countyCountMap} 
            />
          </div>
        </div>
        : propertiesData?.length === 0 && hasSearched 
        ? <InfoCard line1='No results found' />
        :  <div className={styles['info-section']}>
            <InfoCard line1='Select a date range' line2='to generate report' />
          </div>
      }
    </div>
  );
}
