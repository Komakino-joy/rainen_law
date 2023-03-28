import React, { useState } from 'react'
import { Policy } from '@/types/common';
import { ChevronUp, ChevronDown, PencilIcon } from '../Icons/Icons';
import styles from './PoliciesByCompanyCard.module.scss'
import { timestampToDate } from '@/utils';
import formatNumber from '@/utils/formatNumber';

interface PoliciesByCompanyCardProps {
  handleCardClick: (e: React.SyntheticEvent, id: string) => void;
  policiesByCompany: any;
  companyName: string;
  policyId: string;
}

const PoliciesByCompanyCard:React.FC<PoliciesByCompanyCardProps> = ({
  handleCardClick,
  policiesByCompany: cProps,
  policyId, 
  companyName
}) => {

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <>
      { cProps && cProps.length > 0 &&
        <div className={`flex-y ${styles['policy-card-wrapper']}`}>
          <header className='flex-x'>
            <h4 className={`${companyName.slice(0,15) === 'NO_COMPANY_NAME' ? styles['no-company-name'] : ''}`} >
              {policyId} | {companyName} 
            </h4>
            
            <div onClick={() => setIsExpanded(!isExpanded)}>
              <span className='italicized-record-count'>(Policies: {cProps.length})</span>
              { isExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </header>

          <div className={`${isExpanded ? styles.expanded : ''} ${styles['dropdown-content']}`}>
              { cProps.map((policy:Policy) => {          

                  return (
                    <div 
                      key={policy.id}
                      onClick={(e) => handleCardClick(e, policy.id)} 
                      className={`flex-x ${styles['policy-card-info']}`}
                    >
                      <section className='flex-y f-75 gap-sm'>
                        <span><b>File Number:&nbsp;</b>{policy.IFILE}</span>
                        <span><b>Status:&nbsp;</b>{policy.ISTAT}</span>
                        <span><b>Policy Date:&nbsp;</b>{policy.IPOLDATE ? timestampToDate(policy.IPOLDATE, 'mmDDyyyy').date : 'n/a' }</span>
                        <span><b>Premium Due:&nbsp;</b>${policy.PREMDUE ? formatNumber(policy.PREMDUE) : '0.00'}</span>
                      </section>
                      <section className='flex-y f-100 gap-sm'>
                        <span><b>O Policy Number:&nbsp;</b>{policy.OPOLICYNUM || 'n/a'}</span>
                        <span><b>L Policy Number:&nbsp;</b>{policy.LPOLICYNUM || 'n/a'}</span>
                        <span><b>Date Billed:&nbsp;</b>{policy.DATEBILLED ?timestampToDate(policy.DATEBILLED, 'mmDDyyyy').date : 'n/a'}</span>
                        <span><b>Premium Paid:&nbsp;</b>${policy.PREMPAID ? formatNumber(policy.PREMPAID) : '0.00'}</span>
                      </section>
                      <section className='flex-y f-100 gap-sm'>
                        <span><b>O Policy Amount:&nbsp;</b>${policy.OPOLICYAMT ? formatNumber(policy.OPOLICYAMT) : '0.00'}</span>
                        <span><b>L Policy Amount:&nbsp;</b>${policy.LPOLICYAMT ? formatNumber(policy.LPOLICYAMT) : '0.00'}</span>
                        <span><b>Date Paid:&nbsp;</b>{policy.DATEPAID ? timestampToDate(policy.DATEPAID, 'mmDDyyyy').date : 'n/a'}</span>
                        <span><b>Agent Fee:&nbsp;</b>${policy.AGENTFEE ? formatNumber(policy.AGENTFEE) : '0.00'}</span>
                      </section>
                      <span title={`Edit ${'address'}`}>
                        <PencilIcon />
                      </span>
                    </div> 
                  )
                })
              }
          </div>      
        </div>
      }
    </>
  )
}

export default PoliciesByCompanyCard