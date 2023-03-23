import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

import { timestampToDate } from '@/utils';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';
import InfoCard from '@/components/InfoCard/InfoCard';
import FormInput from '@/components/Forms/Common/FormInput/FormInput';

import styles from './CompanyActivityReport.module.scss'
import { CompanyActivityReportTotDollarsEntry, CompanyActivityReportTotDollarsPctEntry, CompanyActivityReportYearlyTotalEntry } from '@/types/common';
import formatNumber from '@/utils/formatNumber';

export default function CompanyActivityReport() {
  
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, sethasSearched] = useState(false)
  const [totalDollarsReportData, setTotalDollarsReportData] = useState({
    rows:[],
    avgPremTotal: 0,
    q1Total: 0,
    q2Total: 0,
    q3Total: 0,
    q4Total: 0,
    q1AgentFeeTotal: 0,
    q2AgentFeeTotal: 0,
    q3AgentFeeTotal: 0,
    q4AgentFeeTotal: 0
  })
  const [totalDollarsPctReportData, setTotalDollarsPctReportData] = useState([])
  const [yearlyTotalsReportData, setYearlyTotalsReportData] = useState({
    rows: [],
    total_prem_ytd: 0,
    total_prem_past_12_months: 0,
    average_prem: 0,
    total_prem_ytd_af: 0,
    total_prem_past_12_months_af: 0,
    average_prem_af: 0,
  })

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

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/post-company-activity-report`, data)

    const totalDollars = response.data.totalDollars.reduce((acc: any, record: CompanyActivityReportTotDollarsEntry) => {
      acc.rows.push(record)
      acc.avgPremTotal = acc.avgPremTotal + record.avg_prem
      acc.q1Total = acc.q1Total + Number(record.qtr_1)
      acc.q2Total = acc.q2Total + Number(record.qtr_2)
      acc.q3Total = acc.q3Total + Number(record.qtr_3)
      acc.q4Total = acc.q4Total + Number(record.qtr_4)
      acc.q1AgentFeeTotal = acc.q1AgentFeeTotal + Number(record.qtr_1_af)
      acc.q2AgentFeeTotal = acc.q2AgentFeeTotal + Number(record.qtr_2_af)
      acc.q3AgentFeeTotal = acc.q3AgentFeeTotal + Number(record.qtr_3_af)
      acc.q4AgentFeeTotal = acc.q4AgentFeeTotal + Number(record.qtr_4_af)

      return acc
    }, {        
      rows: [],
      avgPremTotal: 0,
      q1Total: 0,
      q2Total: 0,
      q3Total: 0,
      q4Total: 0,
      q1AgentFeeTotal: 0,
      q2AgentFeeTotal: 0,
      q3AgentFeeTotal: 0,
      q4AgentFeeTotal: 0
    })

    const yearlyTotals = response.data.yearlyTotals.reduce((acc: any, record: CompanyActivityReportYearlyTotalEntry) => {
      acc.rows.push(record)
      acc.total_prem_ytd = acc.total_prem_ytd + Number(record.total_prem_ytd)
      acc.total_prem_past_12_months = acc.total_prem_past_12_months + Number(record.total_prem_past_12_months)
      acc.average_prem = acc.average_prem + Number(record.average_prem)
      acc.total_prem_ytd_af = acc.total_prem_ytd_af + Number(record.total_prem_ytd_af)
      acc.total_prem_past_12_months_af = acc.total_prem_past_12_months_af + Number(record.total_prem_past_12_months_af)
      acc.average_prem_af = acc.average_prem_af + Number(record.average_prem_af)

      return acc
    }, {
      rows: [],
      total_prem_ytd: 0,
      total_prem_past_12_months: 0,
      average_prem: 0,
      total_prem_ytd_af: 0,
      total_prem_past_12_months_af: 0,
      average_prem_af: 0,
    })

    setTotalDollarsReportData(totalDollars)
    setTotalDollarsPctReportData(response.data.totalDollarsPct)
    setYearlyTotalsReportData(yearlyTotals)
    
    reset()
    setIsLoading(false)
    sethasSearched(true)
  };

  const dataWithRows = totalDollarsReportData.rows?.length > 0 && totalDollarsPctReportData.length > 0 && yearlyTotalsReportData.rows?.length > 0

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const getPageMargins = () => {
    return `@page { margin: 10px 20px !important; }`;
  }

  return (
    <div className={`flex-y gap-md ${styles['company-activity-page-content'] }`}>
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
        : dataWithRows  ?
        <div className={`${styles['company-activity-report-wrapper']}`} >
          <style>{getPageMargins()}</style>
            <Button 
              onClick={handlePrint} 
              isDisabled={false} 
              type={'button'}
              customClass={styles['print-report-button']}
            >
              Print Report
            </Button>
          <div ref={componentRef} className={`report-font ${styles['company-activity-report-printable-area']}`}>
            <header>
              <p>QUARTERLY TITLE INS. STATS.</p>
              <p>
              {timestampToDate(reportRunDate.start, 'mmDDyyyy').date} - {timestampToDate(reportRunDate.end, 'mmDDyyyy').date}
              </p>
            </header>
            <section>
              <p className={styles['section-header']}>GROSS PREMIUMS: PERCENT OF TOTALS BY COMPANY</p>
              <table className={styles['company-activity-report-table']}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                    <th>Avg.</th>
                  </tr>
                </thead>
                { totalDollarsPctReportData.map((row: CompanyActivityReportTotDollarsPctEntry) => (
                    <tr key={row.tticoname}>
                      <td>{row.tticoname}</td>
                      <td>{row.qtr_1 ? formatNumber(row.qtr_1) : '0'}%</td>
                      <td>{row.qtr_2 ? formatNumber(row.qtr_2) : '0'}%</td>
                      <td>{row.qtr_3 ? formatNumber(row.qtr_3) : '0'}%</td>
                      <td>{row.qtr_4 ? formatNumber(row.qtr_4) : '0'}%</td>
                      <td>{row.avg_pct_all ? formatNumber(row.avg_pct_all) : '0'}%</td>
                    </tr>
                  )) 
                }
              </table>
            </section>
            <section>
              <p className={styles['section-header']}>GROSS PREMIUMS: DOLLARS BY COMPANY</p>
              <table className={styles['company-activity-report-table']}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                    <th>Avg.</th>
                  </tr>
                </thead>
                { totalDollarsReportData.rows.map((row: CompanyActivityReportTotDollarsEntry) => (
                    <tr key={row.tticoname}>
                      <td>{row.tticoname}</td>
                      <td>{row.qtr_1 ? formatNumber(row.qtr_1) : '0.00'}</td>
                      <td>{row.qtr_2 ? formatNumber(row.qtr_2) : '0.00'}</td>
                      <td>{row.qtr_3 ? formatNumber(row.qtr_3) : '0.00'}</td>
                      <td>{row.qtr_4 ? formatNumber(row.qtr_4) : '0.00'}</td>
                      <td>{row.avg_prem ? formatNumber(row.avg_prem) : '0.00'}</td>
                    </tr>
                  )) 
                }
                <tr className={styles['summary-row-top']}>
                  <td>Totals:</td>
                  <td>{formatNumber(totalDollarsReportData.q1Total)}</td>
                  <td>{formatNumber(totalDollarsReportData.q2Total)}</td>
                  <td>{formatNumber(totalDollarsReportData.q3Total)}</td>
                  <td>{formatNumber(totalDollarsReportData.q4Total)}</td>
                  <td>{formatNumber(totalDollarsReportData.avgPremTotal)}</td>
                </tr>
                <tr className={styles['summary-row-bottom']}>
                  <td>AGENT'S PORTION:</td>
                  <td>{formatNumber(totalDollarsReportData.q1AgentFeeTotal)}</td>
                  <td>{formatNumber(totalDollarsReportData.q2AgentFeeTotal)}</td>
                  <td>{formatNumber(totalDollarsReportData.q3AgentFeeTotal)}</td>
                  <td>{formatNumber(totalDollarsReportData.q4AgentFeeTotal)}</td>
                  <td></td>
                </tr>
              </table>
            </section>
            <section>
              <p className={styles['section-header']}>YEARLY TOTALS</p>
              <table className={styles['company-activity-report-table']}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Current YTD</th>
                    <th>Last 12 Months</th>
                    <th>Avg. (Last12)</th>
                  </tr>
                </thead>
                { yearlyTotalsReportData.rows.map((row: CompanyActivityReportYearlyTotalEntry) => (
                    <tr key={row.tticoname}>
                      <td>{row.tticoname}</td>
                      <td>{row.total_prem_ytd ? formatNumber(row.total_prem_ytd) : '0.00'}</td>
                      <td>{row.total_prem_past_12_months ? formatNumber(row.total_prem_past_12_months) : '0.00'}</td>
                      <td>{row.average_prem ? formatNumber(row.average_prem) : '0.00'}</td>
                    </tr>
                  )) 
                }
                <tr className={styles['summary-row-top']}>
                  <td>Totals:</td>
                  <td>{formatNumber(yearlyTotalsReportData.total_prem_ytd)}</td>
                  <td>{formatNumber(yearlyTotalsReportData.total_prem_past_12_months)}</td>
                  <td>{formatNumber(yearlyTotalsReportData.average_prem)}</td>
                </tr>
                <tr className={styles['summary-row-bottom']}>
                  <td>AGENT'S PORTION:</td>
                  <td>{formatNumber(yearlyTotalsReportData.total_prem_ytd_af)}</td>
                  <td>{formatNumber(yearlyTotalsReportData.total_prem_past_12_months_af)}</td>
                  <td>{formatNumber(yearlyTotalsReportData.average_prem_af)}</td>
                </tr>
              </table>
            </section>

          </div>
        </div>
        : !dataWithRows && hasSearched 
        ? <InfoCard line1='Something went wrong' line2='Please try again' />
        :  <div className={styles['info-section']}>
            <InfoCard line1='Select a date range' line2='to generate report' />
          </div>
      }
    </div>
  );
}
