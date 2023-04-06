import { Property } from "@/types/common";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import toast from "react-hot-toast";
import 'react-tabs/style/react-tabs.css';

import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";
import PrintPropertyLabel from "@/components/PrintPropertyLabel/PrintPropertyLabel";
import SubTableSellerBuyer from "@/components/Tables/SubTableSellerBuyer/SubTableSellerBuyer";

import dbRef from "@/constants/dbRefs";

import { 
  httpGetPropertyCompRef, 
  httpPostInsertProperty, 
  httpPostSelectedProperty, 
  httpPostUpdateProperty 
} from "@/services/http";

import { FORM_BUTTON_TEXT, PropertyStatusCodeMapType, PROPERTY_STATUS_CODES_MAP } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useClientsContext } from "@/context/Clients";
import { useExaminersContext } from "@/context/Examiners";
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
  const {examinersDropDownOptions} = useExaminersContext()
  const {clientSelectOptions} = useClientsContext()
  const {
    propertyStatusDropDownOptions, 
    propertyTypeDropDownOptions
  } = useSelectDropDownsContext()
  const { c_name: clientNames } = clientSelectOptions
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
    p_number: string | null;
    compRef: string | null;
    lastUpdated: {
      date:string, 
      time:string
    } | null;
  }>({
    id: '', 
    address: '',
    p_number: '',
    compRef: null,
    lastUpdated: null
  })

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
            id='', p_city='', p_street='', p_state='', p_zip='', 
            p_book_1='', p_book_2='', p_page_1='', p_page_2='',
            p_cert_1='', p_lot='', p_condo='', p_unit='', p_status='', p_type='', 
            p_assign='', c_name='', p_comp_ref='', p_file='', c_file='', 
            p_requester='', p_request_date='', p_closed_date='', p_instructions='', last_updated='', p_number='',
            p_input_date='', seller_1='', seller_2='', seller_3='', seller_4='', buyer_1='', buyer_2=''
          } = propertyData

          setPrintLabelInfo((prevState) => ({
            ...prevState,
            p_request_date, p_type, p_input_date, p_comp_ref, p_unit, p_condo, p_book_1, p_book_2, p_page_1, c_file, 
            p_page_2, p_cert_1, seller_1, seller_2, seller_3, seller_4, buyer_1, buyer_2, p_instructions, c_name, p_requester
          }))

          setPropertyInfoSnippet((prevState) => ({
            ...prevState,
            id: id,
            p_number: p_number,
            address: `${p_city} / ${p_street}`,
            compRef: p_comp_ref,
            lastUpdated: last_updated ? timestampToDate(last_updated, 'mmDDyyyy') : null
          }))
    
          setIsLoading(false)
          
          setDefaultSelectValues({
            state: p_state || '',
            status: p_status || '',
            type: p_type || '',
            assigned: p_assign || '',
            clientName: c_name || ''
          })

          return {
            p_state,
            p_status,
            p_type,
            p_assign ,
            clientName:  c_name,
            p_city ,
            p_zip ,
            p_book_1 ,
            p_book_2 ,
            p_page_1 ,
            p_page_2 ,
            p_cert_1 ,
            p_street ,
            p_lot ,
            p_condo ,
            p_unit ,
            p_comp_ref ,
            p_file ,
            c_file ,
            p_requester ,
            p_request_date: p_request_date ? timestampToDate(p_request_date, "yyyyMMdd").date : '',
            p_closed_date: p_closed_date ?timestampToDate(p_closed_date, "yyyyMMdd").date : '',
            p_instructions,
            buyer_1, 
            buyer_2, 
            seller_1,
            seller_2,
            seller_3,
            seller_4,
          };
        } else if (queryType === 'insert') {
          const newCompRef = await httpGetPropertyCompRef()
          return {
            p_comp_ref: newCompRef
          }
        }
      }
    }
  );

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const onSubmit = async(data:any) => {
    if(isDirtyAlt) return 
    
    if(queryType === 'insert') {
      const response = await httpPostInsertProperty({
        data,
        username: user.username
      })

      reset()
      handleAfterSubmit(response.newPropId)
      // @ts-ignore
      toast[response.status](response.message)
    }

    if(queryType === 'update') {
      const response = await httpPostUpdateProperty({
        data,
        id: propertyInfoSnippet.id, // Passing id to update correct record
        username: user.username
      })
      handleAfterSubmit(propertyInfoSnippet.id)
      reset(response.updatedRecord)
      // @ts-ignore
      toast[response.status](response.message)
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
                  name={dbRef.properties.p_city}
                  labelKey={dbRef.properties.p_city}
                  labelText="City"
                  customClass={styles.city}
                  type="text" 
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />

                <Controller 
                  name={dbRef.properties.p_state} 
                  control={control} 
                  defaultValue={defaultSelectValues.state}
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name={dbRef.properties.p_state} 
                        labelKey={dbRef.properties.p_state} 
                        labelText="State"
                        type="select" 
                        defaultValue={defaultSelectValues.state}
                        customClass={styles.state}
                        selectOnChange={onChange}
                        options={abbreviatedStatesLabelValuePair}
                        isRequired={false}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />

                <FormInput 
                  name={dbRef.properties.p_zip} 
                  labelKey={dbRef.properties.p_zip} 
                  labelText="Zip Code"
                  customClass={styles.zip}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />
              </div>

              <FormInput 
                name={dbRef.properties.p_street} 
                labelKey={dbRef.properties.p_street} 
                labelText="Street"
                customClass={styles.street}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <div className={`flex-x ${styles['lot-condo-unit-section']}`}>
                <FormInput 
                  name={dbRef.properties.p_lot} 
                  labelKey={dbRef.properties.p_lot} 
                  labelText="Lot"
                  customClass={styles.lot}
                  type="text" 
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />
                
                <FormInput 
                  name={dbRef.properties.p_condo} 
                  labelKey={dbRef.properties.p_condo} 
                  labelText="Condo"
                  customClass={styles.condo}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />

                <FormInput 
                  name={dbRef.properties.p_unit} 
                  labelKey={dbRef.properties.p_unit} 
                  labelText="Unit"
                  customClass={styles.unit}
                  type="text" 
                  isRequired={false}
                  register={register} 
                  errors={errors}
                />
              </div>

            </div>

            <div className={`flex-y jc-start ${styles['column-2']}`}>
              <FormInput 
                name={dbRef.properties.p_book_1} 
                labelKey={dbRef.properties.p_book_1} 
                labelText="Book 1"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.properties.p_book_2} 
                labelKey={dbRef.properties.p_book_2} 
                labelText="Book 2"
                customClass={styles.book2}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

            </div>

            <div className={`flex-y ${styles['column-3']}`}>
              <FormInput 
                name={dbRef.properties.p_page_1} 
                labelKey={dbRef.properties.p_page_1} 
                labelText="Page 1"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.properties.p_page_2} 
                labelKey={dbRef.properties.p_page_2} 
                labelText="Page 2"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.properties.p_cert_1} 
                labelKey={dbRef.properties.p_cert_1} 
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
                  name={dbRef.properties.p_status}   
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name={dbRef.properties.p_status} 
                        labelKey={dbRef.properties.p_status} 
                        labelText="Status"
                        defaultValue={defaultSelectValues.status}
                        type="select" 
                        selectOnChange={onChange}
                        options={propertyStatusDropDownOptions}
                        isRequired={false}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
              { propertyTypeDropDownOptions && propertyTypeDropDownOptions.length > 0 &&
                <Controller 
                  name={dbRef.properties.p_type}   
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name={dbRef.properties.p_type}
                        labelKey={dbRef.properties.p_type}
                        labelText="Type"
                        defaultValue={defaultSelectValues.type}
                        type="select" 
                        selectOnChange={onChange}
                        options={propertyTypeDropDownOptions}
                        isRequired={false}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }
            </div>

            <div className={`flex-x gap-sm ${styles['seller-section']}`}>
              <FormInput 
                name={dbRef.buyer_seller.seller_1}
                labelKey={dbRef.buyer_seller.seller_1}
                labelText="Seller 1"
                type="text" 
                customClass="f-100"
                isRequired={false}
                register={register} 
                errors={errors}
              />
              <FormInput 
                name={dbRef.buyer_seller.seller_2}
                labelKey={dbRef.buyer_seller.seller_2}
                labelText="Seller 2"
                type="text" 
                customClass="f-100"
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-x gap-sm ${styles['seller-section']}`}>
              <FormInput 
                name={dbRef.buyer_seller.seller_3}
                labelKey={dbRef.buyer_seller.seller_3}
                labelText="Seller 3"
                type="text" 
                customClass="f-100"
                isRequired={false}
                register={register} 
                errors={errors}
              />
              <FormInput 
                name={dbRef.buyer_seller.seller_4}
                labelKey={dbRef.buyer_seller.seller_4}
                labelText="Seller 4"
                type="text" 
                customClass="f-100"
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-x gap-sm ${styles['buyer-section']}`}>
              <FormInput 
                name={dbRef.buyer_seller.buyer_1}
                labelKey={dbRef.buyer_seller.buyer_1}
                labelText="Buyer 1"
                type="text" 
                customClass="f-100"
                isRequired={false}
                register={register} 
                errors={errors}
              />
              <FormInput 
                name={dbRef.buyer_seller.buyer_2}
                labelKey={dbRef.buyer_seller.buyer_2}
                labelText="Buyer 2"
                type="text" 
                customClass="f-100"
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
                  rules={{ required: true }}
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="clientName"
                        labelKey="clientName"
                        labelText="Client Name"
                        type="select" 
                        defaultValue={defaultSelectValues.clientName}
                        customClass={styles.clientName}
                        selectOnChange={onChange}
                        options={clientNames}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }

              <FormInput 
                name={dbRef.properties.p_comp_ref}
                labelKey={dbRef.properties.p_comp_ref}
                labelText="Comp Ref"
                customClass={styles.compRef}
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                disabled
              />

              <FormInput  
                name={dbRef.properties.p_file}
                labelKey={dbRef.properties.p_file}
                labelText="File #"
                customClass={styles.fileNumber}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.properties.c_file}
                labelKey={dbRef.properties.c_file}
                labelText="Client's File #"
                customClass={styles.clientFileNumber}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>

            <div className={`flex-x ${styles['requester-req-date-close-date-section']}`}>
              { examinersDropDownOptions && examinersDropDownOptions.length > 0 &&
                <Controller 
                  name={dbRef.properties.p_assign}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name={dbRef.properties.p_assign}
                        labelKey={dbRef.properties.p_assign}
                        labelText="Assigned"
                        type="select" 
                        defaultValue={defaultSelectValues.assigned}
                        customClass={styles.assigned}
                        selectOnChange={onChange}
                        options={examinersDropDownOptions}
                        isRequired={false}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
              }

              <FormInput 
                name={dbRef.properties.p_requester}
                labelKey={dbRef.properties.p_requester}
                labelText="Requester"
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
              <FormInput 
                name={dbRef.properties.p_request_date}
                labelKey={dbRef.properties.p_request_date}
                labelText="Request Date"
                type="date" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
              <FormInput 
                name={dbRef.properties.p_closed_date}
                labelKey={dbRef.properties.p_closed_date}
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
              name={dbRef.properties.p_instructions}
              labelKey={dbRef.properties.p_instructions}
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
      { queryType === 'update' && propertyInfoSnippet.compRef ?
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