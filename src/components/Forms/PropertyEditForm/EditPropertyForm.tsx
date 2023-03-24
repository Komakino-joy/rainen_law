import { Property } from "@/types/common";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from "axios";
import toast from "react-hot-toast";
import 'react-tabs/style/react-tabs.css';

import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";
import SubTableINS from "@/components/Tables/SubTableINS/SubTableINS";
import PrintPropertyLabel from "@/components/PrintPropertyLabel/PrintPropertyLabel";
import SubTableSellerBuyer from "@/components/Tables/SubTableSellerBuyer/SubTableSellerBuyer";

import { FORM_BUTTON_TEXT } from "@/constants";
import { useClientsContext } from "@/context/Clients";
import { usePropertiesContext } from "@/context/Properties";
import { timestampToDate, abbreviatedStatesLabelValuePair } from "@/utils";

import styles from './EditPropertyForm.module.scss'

interface EditPropertyFormProps {
  propertyId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (propId: string) => void;
}

const EditPropertyForm:React.FC<EditPropertyFormProps> = ({
  propertyId,
  queryType, 
  handleAfterSubmit = () => {},
}) => {
  const {clientSelectOptions} = useClientsContext()
  const {propertiesSelectOptions} = usePropertiesContext()
  const { CNAME: clientNames } = clientSelectOptions

  const {
    PSTAT: statusOptions,
    PTYPE: typeOptions,
    PASIGN: assignOptions,
  } = propertiesSelectOptions
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [compRef, setCompRef] = useState(null)
  const [titlesCount, setTitlesCount] = useState(null)
  const [printLabelInfo, setPrintLabelInfo] = useState({})
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    state: '',
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-new-comp-ref`)
        setCompRef(response.data.newCompRef)
      })();
  },[])

  const { 
    register, 
    handleSubmit, 
    control,
    getValues,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
      defaultValues: async () => {
        if (propertyId) {

          setIsLoading(true)
          
          const response = await axios.post('/api/properties/post-selected-property', {propertyId})
          
          const {
            id='', PCITY='', PSTRET='', PSTATE='', PZIP='', 
            PBOOK1='', PBOOK2='', PDOCNUM='', PPAGE1='', PPAGE2='',
            PCERT1='', PLOT='', PCONDO='', PUNIT='', PSTAT='', PTYPE='', 
            PASIGN='', CNAME='', PCOMPREF='', PFILE='', CFILE='', 
            PREQ='', PRDATE='', PCDATE='', PINSTR='', last_updated='', PNMBR='',
            PTDATE='', PSELR1='', PSELR2='', PSELR3='', PSELR4='', PBUYR1='', PBUYR2=''
          } = response.data[0]

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
            state: PSTATE,
            status: PSTAT,
            type:PTYPE,
            assigned: PASIGN,
            clientName: CNAME
          })

          return {
            city: PCITY ,
            state: PSTATE ,
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
      const response = await axios.post(`/api/properties/post-insert-property`, data)
      reset()
      handleAfterSubmit(response.data.newPropId)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/properties/post-update-property`, {id: propertyInfoSnippet.id, ...data}) // Passing id to update correct record
      handleAfterSubmit(propertyInfoSnippet.id)
      reset(response.data.updatedRecord)
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
              { statusOptions && statusOptions.length > 0 &&
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
                        options={statusOptions}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
              { typeOptions && typeOptions.length > 0 &&
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
                        options={typeOptions}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
              { assignOptions && assignOptions.length > 0 &&
                <Controller 
                  name={"assigned"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="assigned"
                        labelKey="assigned"
                        labelText="Assigned"
                        defaultValue={defaultSelectValues.assigned}
                        type="select" 
                        selectOnChange={onChange}
                        options={assignOptions}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
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
            <Tab>Titles{titlesCount ? <span className="italicized-record-count">({titlesCount})</span>  : ''}</Tab>
          </TabList>

          <TabPanel>
            <SubTableSellerBuyer 
              compRef={propertyInfoSnippet.compRef} 
            />
          </TabPanel>
          <TabPanel>
            <SubTableINS 
              inmbr={propertyInfoSnippet.pnmbr} 
              setTitlesCount={setTitlesCount}
            />
          </TabPanel>
        </Tabs>
        : null
      }
    </div>
  );
}


export default EditPropertyForm;