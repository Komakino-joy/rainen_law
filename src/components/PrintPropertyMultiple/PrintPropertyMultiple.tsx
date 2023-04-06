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
                p_type, 
                p_comp_ref,
                p_unit, 
                p_condo,
                p_book_1, 
                p_book_2, 
                p_page_1, 
                p_page_2, 
                p_cert_1,
                seller_1, 
                seller_2,
                seller_3, 
                seller_4,
                buyer_1, 
                buyer_2,
                p_instructions,
                c_name, 
                p_requester,
                c_file,
                p_request_date, 
                p_input_date
              } = property

              const formatp_request_date = `${hasValue(p_request_date) ? timestampToDate(p_request_date, 'mmDDyyyy').date : ''}`
              const formatp_input_date = `${hasValue(p_input_date) ? timestampToDate(p_input_date, 'mmDDyyyy').date : ''}`
              const formatp_unit = p_unit ? `unit ${p_unit}` : ''

              return (
                <div 
                  key={p_comp_ref} 
                  style={{
                    fontSize: '10px',
                    height: '99.5px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    fontFamily: `'Times New Roman','Courier New', Courier, monospace`, 
                  }}
                >
                  <p> { formatp_request_date}&nbsp;{'('}<b>{p_type}</b>{') '}<span style={{fontSize: '12px'}}>{'(Input '}{formatp_input_date}{') '}</span>{'CR#'}{p_comp_ref || ''}</p>
                  <p> {`${formatp_unit} ${p_condo || ''}`} </p>
                  <p> {`B:${p_book_1 || ''} P:${p_page_1 || ''} B:${p_book_2 || ''} P:${p_page_2 || ''} C:${p_cert_1 || ''}`} </p>
                  <p> {`S:${seller_1 || ''} S:${seller_2 || ''}`} </p>
                  <p> {`S:${seller_3 || ''} S:${seller_4 || ''}`} </p>
                  <p> {`B:${buyer_1 || ''} B:${buyer_2 || ''}`} </p>
                  <p> {`*${p_instructions || ''}`} </p>
                  <p> {`${c_name || ''}, ${p_requester || ''}`} </p>
                  <p> {`${c_file || ''}`} </p>
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