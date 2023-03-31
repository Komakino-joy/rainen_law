import { Property } from "@/types/common";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import toast from "react-hot-toast";
import 'react-tabs/style/react-tabs.css';

import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";
import PrintPropertyLabel from "@/components/PrintPropertyLabel/PrintPropertyLabel";
import SubTableSellerBuyer from "@/components/Tables/SubTableSellerBuyer/SubTableSellerBuyer";

import { 
  httpGetPropertyCompRef, 
  httpPostInsertProperty, 
  httpPostSelectedProperty, 
  httpPostUpdateProperty 
} from "@/services/http";

import { FORM_BUTTON_TEXT } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useClientsContext } from "@/context/Clients";
import { useSelectDropDownsContext } from "@/context/SelectDropDowns";
import { timestampToDate, abbreviatedStatesLabelValuePair } from "@/utils";

import styles from './EditPropertyForm.module.scss'

interface EditPropertyFormProps {
  propertyId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (id: string) => void;
}

const EditPropertyForm:React.FC<EditPropertyFormProps> = ({
  propertyId,
  queryType, 
  handleAfterSubmit = () => {},
}) => {
  const {user} = useAuth()
  const {clientSelectOptions} = useClientsContext()
  const {
    propertyStatusDropDownOptions, 
    propertyTypeDropDownOptions
  } = useSelectDropDownsContext()
  const { CNAME: clientNames } = clientSelectOptions
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [compRef, setCompRef] = useState(null)
  const [printLabelInfo, setPrintLabelInfo] = useState({})
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    state: 'MA',
    status: '',
    type:'',
    assigned: '',
    clientName: ''
  })

  const [propertyInfoSnippet, setPropertyInfoSnippet] = useState<{
    id:string;
    address:string;
    pnmbr: string | null;
    compRef: string | null;
    lastUpdated: {
      date:string, 
      time:string
    } | null;
  }>({
    id: '', 
    address: '',
    pnmbr: '',
    compRef: null,
    lastUpdated: null
  })

  useEffect(() => {
    if(queryType === 'insert') (async() => {
        const compRef = await httpGetPropertyCompRef()
        setCompRef(compRef)
      })();
  },[])

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
      defaultValues: async () => {
        if (propertyId) {

          setIsLoading(true)
          
          const propertyData = await httpPostSelectedProperty({id: propertyId})
          
          const {
            id='', PCITY='', PSTRET='', PSTATE='', PZIP='', 
            PBOOK1='', PBOOK2='', PDOCNUM='', PPAGE1='', PPAGE2='',
            PCERT1='', PLOT='', PCONDO='', PUNIT='', PSTAT='', PTYPE='', 
            PASIGN='', CNAME='', PCOMPREF='', PFILE='', CFILE='', 
            PREQ='', PRDATE='', PCDATE='', PINSTR='', last_updated='', PNMBR='',
            PTDATE='', PSELR1='', PSELR2='', PSELR3='', PSELR4='', PBUYR1='', PBUYR2=''
          } = propertyData

          setPrintLabelInfo((prevState) => ({
            ...prevState,
            PRDATE, PTYPE, PTDATE, PCOMPREF, PUNIT, PCONDO, PBOOK1, PBOOK2, PPAGE1, CFILE, 
            PPAGE2, PCERT1, PSELR1, PSELR2, PSELR3, PSELR4, PBUYR1, PBUYR2, PINSTR, CNAME, PREQ
          }))

          setPropertyInfoSnippet((prevState) => ({
            ...prevState,
            id: id,
            pnmbr: PNMBR,
            address: `${PCITY} / ${PSTRET}`,
            compRef: PCOMPREF,
            lastUpdated: last_updated ? timestampToDate(last_updated, 'mmDDyyyy') : null
          }))
    
          setIsLoading(false)

          setDefaultSelectValues({
            state: PSTATE || '',
            status: PSTAT || '',
            type:PTYPE || '',
            assigned: PASIGN || '',
            clientName: CNAME || ''
          })

          return {
            city: PCITY ,
            zip: PZIP ,
            book1: PBOOK1 ,
            book2: PBOOK2 ,
            docNumber: PDOCNUM ,
            page1: PPAGE1 ,
            page2: PPAGE2 ,
            cert1: PCERT1 ,
            street: PSTRET ,
            lot: PLOT ,
            condo: PCONDO ,
            unit: PUNIT ,
            status: {label: PSTAT, value:PSTAT} ,
            type: PTYPE ,
            assigned: PASIGN ,
            clientName:  CNAME,
            compRef: PCOMPREF ,
            fileNumber: PFILE ,
            clientFileNumber: CFILE ,
            requester: PREQ ,
            requestDate: PRDATE ? timestampToDate(PRDATE, "yyyyMMdd").date : '',
            closedDate: PCDATE ?timestampToDate(PCDATE, "yyyyMMdd").date : '',
            instructions: PINSTR 
          };
        }
      }
    }
  );

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const onSubmit = async(data:any) => {
    if(isDirtyAlt) return 
    
    if(queryType === 'insert') {
      const newPropId = await httpPostInsertProperty({
        data,
        username: user.username
      })

      reset()
      handleAfterSubmit(newPropId)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const updatedRecord = await httpPostUpdateProperty({
        data,
        id: propertyInfoSnippet.id, // Passing id to update correct record
        username: user.username
      })
      handleAfterSubmit(propertyInfoSnippet.id)
      reset(updatedRecord)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }
  }

  return (
    <div className='form-wrapper edit-form'>
        <header>
          <span>{propertyInfoSnippet.address}</span>
          { propertyInfoSnippet.compRef ?
            <span>Property Ref#: {propertyInfoSnippet.compRef}</span>
            : null
          }
        </header>
      { isLoading ? <Spinner />
        :
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={`flex-x ${styles['top-section']}`}>
            <div className={`flex-y ${styles['column-1']}`}>
              <div className={`flex-x ${styles['city-state-zip-section']}`}>
                <FormInput 
                  name="city"
                  labelKey="city"
                  labelText="City"
                  customClass={styles.city}
                  type="text" 
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />

                <Controller 
                  name={"state"}  
                  control={control} 
                  defaultValue={defaultSelectValues.state}
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="state"
                        labelKey="state"
                        labelText="State"
                        type="select" 
                        defaultValue={defaultSelectValues.state}
                        customClass={styles.state}
                        selectOnChange={onChange}
                        options={abbreviatedStatesLabelValuePair}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />

                <FormInput 
                  name="zip"
                  labelKey="zip"
                  labelText="Zip Code"
                  customClass={styles.zip}
                  type="text" 
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />
              </div>

              <FormInput 
                name="street"
                labelKey="street"
                labelText="Street"
                customClass={styles.street}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <div className={`flex-x ${styles['lot-condo-unit-section']}`}>
                <FormInput 
                  name="lot"
                  labelKey="lot"
                  labelText="Lot"
                  customClass={styles.lot}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />
                
                <FormInput 
                  name="condo"
                  labelKey="condo"
                  labelText="Condo"
                  customClass={styles.condo}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />

                <FormInput 
                  name="unit"
                  labelKey="unit"
                  labelText="Unit"
                  customClass={styles.unit}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />
              </div>

            </div>

            <div className={`flex-y ${styles['column-2']}`}>
              <FormInput 
                name="book1"
                labelKey="book1"
                labelText="Book 1"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="book2"
                labelKey="book2"
                labelText="Book 2"
                customClass={styles.book2}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />


              <FormInput 
                name="docNumber"
                labelKey="docNumber"
                labelText="Doc #"
                customClass={styles.docNumber}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-y ${styles['column-3']}`}>
              <FormInput 
                name="page1"
                labelKey="page1"
                labelText="Page 1"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="page2"
                labelKey="page2"
                labelText="Page 2"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="cert1"
                labelKey="cert1"
                labelText="Cert 1"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>
          </section>

          <section className={`flex-y ${styles['mid-section']}`}>
            <div className={`flex-x ${styles['status-type-assigned-section']}`}>                
              { propertyStatusDropDownOptions && propertyStatusDropDownOptions.length > 0 &&
                <Controller 
                  name={"status"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="status"
                        labelKey="status"
                        labelText="Status"
                        defaultValue={defaultSelectValues.status}
                        type="select" 
                        selectOnChange={onChange}
                        options={propertyStatusDropDownOptions}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
              { propertyTypeDropDownOptions && propertyTypeDropDownOptions.length > 0 &&
                <Controller 
                  name={"type"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="type"
                        labelKey="type"
                        labelText="Type"
                        defaultValue={defaultSelectValues.type}
                        type="select" 
                        selectOnChange={onChange}
                        options={propertyTypeDropDownOptions}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
              <FormInput 
                name="assigned"
                labelKey="assigned"
                labelText="Assigned"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-x ${styles['comp-ref-file-num-section']}`}>
              { clientNames && clientNames.length > 0 &&
                <Controller 
                  name={"clientName"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="clientName"
                        labelKey="clientName"
                        labelText="Name"
                        type="select" 
                        defaultValue={defaultSelectValues.clientName}
                        customClass={styles.clientName}
                        selectOnChange={onChange}
                        options={clientNames}
                        isRequired={false}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }

              <FormInput 
                name="compRef"
                labelKey="compRef"
                labelText="Comp Ref"
                customClass={styles.compRef}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
                disabled
                defaultValue={compRef}
              />

              <FormInput  
                name="fileNumber"
                labelKey="fileNumber"
                labelText="File #"
                customClass={styles.fileNumber}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="clientFileNumber"
                labelKey="clientFileNumber"
                labelText="Client's File #"
                customClass={styles.clientFileNumber}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-x ${styles['requestor-req-date-close-date-section']}`}>
              <FormInput 
                name="requester"
                labelKey="requester"
                labelText="Requester"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
              <FormInput 
                name="requestDate"
                labelKey="requestDate"
                labelText="Request Date"
                type="date" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
              <FormInput 
                name="closedDate"
                labelKey="closedDate"
                labelText="Closed Date"
                type="date" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>
          </section>

          <section className={styles['instructions-section']}>
            <FormInput 
              name="instructions"
              labelKey="instructions"
              labelText="Instructions"
              type="textarea" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            { queryType === 'update' 
              ? <PrintPropertyLabel 
                  propertyInfo={printLabelInfo as Property} 
                /> 
              : null 
            }
            <Button type="submit" isDisabled={isDirtyAlt}>
              {FORM_BUTTON_TEXT[queryType]} 
            </Button>
          </section>

          <footer className="form-footer">
            { propertyInfoSnippet.lastUpdated && 
              <>
                <span>Last Updated: { propertyInfoSnippet.lastUpdated.date }</span>
                <span className="italicized-text">{ propertyInfoSnippet.lastUpdated.time }</span>
              </>
            }
          </footer>
        </form>
      }
      { queryType === 'update' && propertyInfoSnippet.compRef && propertyInfoSnippet.pnmbr ?
        <Tabs>
          <TabList>
            <Tab>Seller / Buyer</Tab>
          </TabList>

          <TabPanel>
            <SubTableSellerBuyer 
              compRef={propertyInfoSnippet.compRef} 
            />
          </TabPanel>
        </Tabs>
        : null
      }
    </div>
  );
}


export default EditPropertyForm;