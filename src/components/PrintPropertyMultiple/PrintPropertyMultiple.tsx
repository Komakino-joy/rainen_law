import { Property } from '@/types/common';
import { hasValue, timestampToDate } from '@/utils';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Button from '../Button/Button'
import { PrinterIcon } from '../Icons/Icons';

import styles from './PrintPropertyMultiple.module.scss'

const PrintPropertyMultiple = ({
  properties, 
  usePrinterIcon,
  children
}: {
  properties: Property[]; 
  usePrinterIcon?:boolean;
  children: any;
}) => {

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const getPageMargins = () => {
    return `@page { 
      margin: 30px 0 30px 20px !important; 
    }`;
  };

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
          {children}
        </Button>
      }

      <div className={`${styles['label-container']}`}>
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
            { properties.map(property => {
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
              } = property

              const formatPRDATE = `${hasValue(PRDATE) ? timestampToDate(PRDATE, 'mmDDyyyy').date : ''}`
              const formatPTDATE = `${hasValue(PTDATE) ? timestampToDate(PTDATE, 'mmDDyyyy').date : ''}`
              const formatPUNIT = PUNIT ? `unit ${PUNIT}` : ''

              return (
                <div 
                  key={PCOMPREF} 
                  style={{
                    fontSize: '10px',
                    height: '99.5px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    fontFamily: `'Times New Roman','Courier New', Courier, monospace`, 
                  }}
                >
                  <p> { formatPRDATE}&nbsp;{'('}<b>{PTYPE}</b>{') '}<span style={{fontSize: '12px'}}>{'(Input '}{formatPTDATE}{') '}</span>{'CR#'}{PCOMPREF || ''}</p>
                  <p> {`${formatPUNIT} ${PCONDO || ''}`} </p>
                  <p> {`B:${PBOOK1 || ''} P:${PPAGE1 || ''} B:${PBOOK2 || ''} P:${PPAGE2 || ''} C:${PCERT1 || ''}`} </p>
                  <p> {`S:${PSELR1 || ''} S:${PSELR2 || ''}`} </p>
                  <p> {`S:${PSELR3 || ''} S:${PSELR4 || ''}`} </p>
                  <p> {`B:${PBUYR1 || ''} B:${PBUYR2 || ''}`} </p>
                  <p> {`*${PINSTR || ''}`} </p>
                  <p> {`${CNAME || ''}, ${PREQ || ''}`} </p>
                  <p> {`${CFILE || ''}`} </p>
                </div>
              )
            })
            }
        </div>
      </div>

    </>
  )
}

export default PrintPropertyMultiple