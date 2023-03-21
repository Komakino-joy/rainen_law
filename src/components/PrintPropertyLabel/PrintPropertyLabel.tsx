import { Property } from '@/types/common';
import { hasValue, timestampToDate } from '@/utils';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Button from '../Button/Button'
import { PrinterIcon } from '../Icons/Icons';

import styles from './PrintPropertyLabel.module.scss'

const PropertyLabel = ({
  propertyInfo, 
  usePrinterIcon
}: {
  propertyInfo: Property; 
  usePrinterIcon?:boolean;
}) => {

  const {
    PTYPE, 
    PCOMPREF,
    PUNIT, 
    PCONDO,
    PBOOK1, 
    PBOOK2, 
    PPAGE1, 
    PPAGE2, 
    PCERT1,
    PSELR1, 
    PSELR2,
    PSELR3, 
    PSELR4,
    PBUYR1, 
    PBUYR2,
    PINSTR,
    CNAME, 
    PREQ,
    CFILE,
    PRDATE, 
    PTDATE
  } = propertyInfo


  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const getPageMargins = () => {
    return `@page { 
      margin: 20px !important; 
    }`;
  };
  
  const formatPRDATE = `${hasValue(PRDATE) ? timestampToDate(PRDATE, 'mmDDyyyy').date : ''}`
  const formatPTDATE = `${hasValue(PTDATE) ? timestampToDate(PTDATE, 'mmDDyyyy').date : ''}`
  const formatPUNIT = PUNIT ? `unit ${PUNIT}` : ''

  return (
    <>
      { usePrinterIcon ? 
        <span onClick={handlePrint}>
          <PrinterIcon />
        </span>  
        :
        <Button 
          type="button" 
          isDisabled={false}
          onClick={handlePrint}
        >
          Print Label
        </Button>
      }

      <div className={styles['label-container']}>
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
            <div style={{lineHeight: '22px', fontFamily: 'monospace', fontSize: '16px'}}>
              <p> { formatPRDATE}&nbsp;{'('}<b>{PTYPE}</b>{') '}<span style={{fontSize: '14px'}}>{'(Input '}{formatPTDATE}{') '}</span>{'CR#'}{PCOMPREF || ''}</p>
              <p> {`${formatPUNIT} ${PCONDO || ''}`} </p>
              <p> {`B:${PBOOK1 || ''} P:${PPAGE1 || ''} B:${PBOOK2 || ''} P:${PPAGE2 || ''} C:${PCERT1 || ''}`} </p>
              <p> {`S:${PSELR1 || ''} S:${PSELR2 || ''}`} </p>
              <p> {`S:${PSELR3 || ''} S:${PSELR4 || ''}`} </p>
              <p> {`B:${PBUYR1 || ''} B:${PBUYR2 || ''}`} </p>
              <p> {`*${PINSTR || ''}`} </p>
              <p> {`${CNAME || ''}, ${PREQ || ''}`} </p>
              <p> {`${CFILE || ''}`} </p>
            </div>
        </div>
      </div>

    </>
  )
}

export default PropertyLabel