import { Client } from '@/types/common';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Button from '../Button/Button'
import { PrinterIcon } from '../Icons/Icons';

import styles from './PrintClientLabelMultiple.module.scss'

const PrintClientLabelMultiple = ({
  clients, 
  usePrinterIcon,
  children
}: {
  clients: Client[]; 
  usePrinterIcon?:boolean;
  children: any;
}) => {

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
          {children}
        </Button>
      }

      <div className={`${styles['label-container']}`}>
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
          { clients.map(client => {

            const {
              CNAME,
              CADD1,
              CADD2,
              CCITY,
              CSTATE,
              CZIP
            } = client

            return (
                <div 
                  key={CNAME}
                  style={{
                    fontSize: '16px',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    fontFamily: `'Times New Roman','Courier New', Courier, monospace`, 
                  }}
                >
                  <p> {CNAME}</p>
                  <p> {CADD1} </p>
                  <p> {CADD2} </p>
                  <p> {`${CCITY || ''} ${CSTATE || ''} ${CZIP || ''}`} </p>
                </div>
              )
            }) 

          }
        </div>
      </div>

    </>
  )
}

export default PrintClientLabelMultiple