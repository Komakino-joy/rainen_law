import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import FormInput from '@/components/Forms/Common/FormInput/FormInput';
import Button from '@/components/Button/Button';
import styles from './PropertyReport.module.scss'
import axios from 'axios';
import { timestampToDate } from '@/utils';
import { Property } from '@/types/common';
import ReportProperties from '@/components/Tables/ReportProperties/ReportProperties';

export default function PropertyReport() {
  
  const [propertiesData, setPropertiesData] = useState<Property[] | null>(null)
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
    reset()
  };

  return (
    <>
      <div className='form-wrapper is-date-selection card-shadow light-border center-margin'>
        <h2>Select a date Range</h2>
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
            <ReportProperties tableData={propertiesData} />
          </div>
        : null
      }
    </>
  );
}
