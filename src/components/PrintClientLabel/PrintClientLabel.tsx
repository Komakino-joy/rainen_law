import { Client } from '@/types/common';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Button from '../Button/Button'
import { PrinterIcon } from '../Icons/Icons';

import styles from './PrintClientLabel.module.scss'

const PrintClientLabel = ({
  clientInfo, 
  usePrinterIcon
}: {
  clientInfo: Client; 
  usePrinterIcon?:boolean;
}) => {

  const {
    CNAME,
    CADD1,
    CADD2,
    CCITY,
    CSTATE,
    CZIP
  } = clientInfo


  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const getPageMargins = () => {
    return `@page { 
      margin: 20px !important; 
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
          Print Label
        </Button>
      }

      <div className={`${styles['label-container']}`}>
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
            <div style={{lineHeight: '22px', fontFamily: `'Courier New', Courier, monospace`, fontSize: '16px'}}>
              <p> {CNAME}</p>
              <p> {CADD1} </p>
              <p> {CADD2} </p>
              <p> {`${CCITY || ''} ${CSTATE || ''} ${CZIP || ''}`} </p>
            </div>
        </div>
      </div>

    </>
  )
}

export default PrintClientLabel