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

export default function PropertyReport() {
  
  const [propertiesData, setPropertiesData] = useState<Property[] | null>(null)
  const [countyCountMap, setCountyCountMap] = useState({})
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
    reset()
  };

  return (
    <div className='center-margin flex-y gap-md'>
      <div className='form-wrapper is-date-selection card-shadow light-border center-margin'>
        <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
          <section className='flex-x gap-sm date-inputs'>
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
            <div className={styles['registry-of-deeds-breakdown']}>
              <p>Breakdown by Registry of Deeds</p>
              <div className={styles['breakdown-by-county']}>
                <div>
                  { Object.keys(countyCountMap).splice(0, Object.keys(countyCountMap).length/2).map(key => (
                      <div key={key} className={styles['county-detail']}>
                        <span>{key}:</span>
                        <span>{countyCountMap[key as keyof typeof countyCountMap]}</span>
                        <span>{((countyCountMap[key as keyof typeof countyCountMap] / propertiesData.length) * 100).toFixed(2)}%</span>
                      </div>
                    ))
                  }
                </div>
                <div>
                  { Object.keys(countyCountMap).splice(Object.keys(countyCountMap).length/2).map(key => (
                      <div key={key} className={styles['county-detail']}>
                        <span>{key}:</span>
                        <span>{countyCountMap[key as keyof typeof countyCountMap]}</span>
                        <span>{((countyCountMap[key as keyof typeof countyCountMap] / propertiesData.length) * 100).toFixed(2)}%</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <ReportProperties tableData={propertiesData} />
          </div>
        : <InfoCard line1='Select a date range' line2='to generate report' />
      }
    </div>
  );
}
