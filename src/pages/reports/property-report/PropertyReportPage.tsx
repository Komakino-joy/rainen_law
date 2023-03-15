import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import FormInput from '@/components/Forms/Common/FormInput/FormInput';
import Button from '@/components/Button/Button';
import styles from './PropertyReport.module.scss'
import axios from 'axios';
import { timestampToDate } from '@/utils';
import { Property, ReportProperty } from '@/types/common';
import ReportProperties from '@/components/Tables/ReportProperties/ReportProperties';
import InfoCard from '@/components/InfoCard/InfoCard';
import RegistryOfDeedsBreakDown from '@/components/RegistryOfDeedsBreakDown/RegistryOfDeedsBreakDown';
import TitlesBreakDown from '@/components/TitleBreakDown/TitlesBreakDown';

export default function PropertyReport() {
  
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
    setReportRunDate({
      start: data.startDate,
      end: data.endDate
    })

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/post-property-report`, data)
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
      if(!acc[propObj.PTYPE]) {
        acc[propObj.PTYPE] = 1
      } else {
        acc[propObj.PTYPE] = acc[propObj.PTYPE] + 1
      }
      return acc
    }, {}))

    reset()
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
      { propertiesData && propertiesData.length > 0 ?
          <div className={styles['property-report-wrapper']}>
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
        : 
        <div className={styles['info-section']}>
          <InfoCard line1='Select a date range' line2='to generate report' />
        </div>
      }
    </div>
  );
}
