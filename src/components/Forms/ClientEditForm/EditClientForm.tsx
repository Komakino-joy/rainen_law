import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast'
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import axios from "axios";

import { FORM_BUTTON_TEXT } from "@/constants";
import { timestampToDate } from "@/utils";
import { abbreviatedStatesLabelValuePair } from "@/utils/UnitedStates";
import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";
import SubTableINS from "@/components/Tables/SubTableINS/SubTableINS";
import SubTableProperties from "@/components/Tables/SubTableProperties/SubTableProperties";
import styles from './EditClientForm.module.scss'
import Spinner from "@/components/Spinner/Spinner";
import PrintClientLabel from "@/components/PrintClientLabel/PrintPropertyLabel";
import { Client } from "@/types/common";

interface EditClientFormProps {
  clientId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (propId: string) => void;
}

const ClientForm:React.FC<EditClientFormProps> = ({
  clientId,
  queryType, 
  handleAfterSubmit = () => {},
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [titlesCount, setTitlesCount] = useState(null)
  const[printLabelInfo, setPrintLabelInfo] = useState({})
  const [defaultSelectValues , setDefaultSelectValues] = useState({
    status: '',
    state: ''
  })
  const [clientInfoSnippet, setClientInfoSnippet] = useState<{
    id:string;
    cnmbr: string | null;
    clientName: string | null;
    lastUpdated: {
      date:string, 
      time:string
    } | null;
  }>({
    id: 'New', 
    cnmbr: null,
    clientName: 'New Client',
    lastUpdated: null
  })

  const { 
    register, 
    handleSubmit, 
    reset,
    control,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: async () => {
      if (clientId) {

        setIsLoading(true)
        
        const response = await axios.post('/api/clients/post-selected-client', {clientId})
        
        const {
          id='', CNMBR='', CNAME='', last_updated=null, CSTAT='', CSEARCH='', CADD1='', 
          CADD2='', CCITY='', CSTATE='', CZIP='', CPHONE='',
          CFAX='', CEMAIL='', CCNTCT='', CSTATTO='', CNOTES=''
        } = response.data[0]

        setPrintLabelInfo((prevState) => ({
          ...prevState,
          CNAME,
          CADD1,
          CADD2,
          CCITY,
          CSTATE,
          CZIP
        }))

        setClientInfoSnippet((prevState) => ({
          ...prevState,
          id: id,
          cnmbr: CNMBR,
          clientName: CNAME,
          lastUpdated: last_updated ? timestampToDate(last_updated, 'mmDDyyyy') : null
        }))
  
        setIsLoading(false)

        setDefaultSelectValues({
          status: CSTAT,
          state: CSTATE
        })

        return {
          clientName: CNAME ,
          status: CSTAT ,
          searchName: CSEARCH ,
          addressLine1: CADD1 ,
          addressLine2: CADD2 ,
          city: CCITY ,
          state: CSTATE ,
          zip: CZIP ,
          phone: CPHONE ,
          fax: CFAX ,
          email: CEMAIL ,
          contact: CCNTCT ,
          statementAddressee: CSTATTO ,
          notes: CNOTES  
        };
      }
    }
  });

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    
    if(queryType === 'insert') {
      const response = await axios.post(`/api/clients/post-insert-client`, data)
      reset()
      handleAfterSubmit(response.data.newPropId)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/clients/post-update-client`, {id: clientInfoSnippet.id, ...data}) // Passing id to update correct record
      handleAfterSubmit(clientInfoSnippet.id)
      reset(response.data.updatedRecord)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }
  };

  return (
    <div className='form-wrapper edit-form'>
      <header>
        <span>{clientInfoSnippet.clientName}</span>
        { clientInfoSnippet.cnmbr ?
            <span> Client Number: {clientInfoSnippet.cnmbr} </span>
          : null
        }
      </header>
      { isLoading ? <Spinner />
        : <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
            <section className={`flex-x ${styles['client-status-section']}`}>
              <FormInput 
                name="clientName"
                customClass={styles.client}
                labelKey="clientName"
                labelText="Client/Firm Name"
                type="text"
                isRequired={true}
                register={register} 
                errors={errors}
              />

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
                      type="select" 
                      defaultValue={defaultSelectValues.status}
                      customClass={styles.status}
                      selectOnChange={onChange}
                      options={[{label:'C', value:'C'}, {label:'O', value:'O'}]}
                      isRequired={true}
                      register={register} 
                      errors={errors}
                    />
                  ) 
                }}
              />
            </section>

            <FormInput 
              name="searchName"
              labelKey="searchName"
              labelText="Search Name"
              type="text"
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="addressLine1"
              labelKey="addressLine1"
              labelText="Address Line 1"
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput
              name="addressLine2" 
              labelKey="addressLine2"
              labelText="Address Line 2"
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <section className={`flex-x ${styles['city-state-zip-section']}`}>
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
            </section>

            <section className={`flex-x ${styles['phone-fax-email-section']}`}>
              <FormInput 
                name="phone"
                labelKey="phone"
                labelText="Phone Number"
                customClass={styles.phone}
                type="tel" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="fax"
                labelKey="fax"
                labelText="Fax Number"
                customClass={styles.fax}
                type="tel" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="email"
                labelKey="email"
                labelText="Email Address"
                customClass={styles.email}
                type="email" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </section>

            <section className={`flex-x ${styles['contact-statement-section']}`}>
              <FormInput 
                name="contact"
                labelKey="contact"
                labelText="Contact"
                customClass={styles.contact}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="statementAddressee"
                labelKey="statementAddressee"
                labelText="Statement Addressee"
                customClass={styles.statement}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </section>


            <section className={styles['notes-section']}>
              <FormInput 
                name="notes"
                labelKey="notes"
                labelText="Notes"
                type="textarea" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </section>

            <section className="submit-button-section">
              { 
                queryType === 'update' 
                ? <PrintClientLabel 
                    clientInfo={printLabelInfo as Client} 
                  /> 
                : null 
              }
              <Button type="submit" isDisabled={!isDirty}>
                {FORM_BUTTON_TEXT[queryType]} 
              </Button>
            </section>

            <footer className="form-footer">
              { clientInfoSnippet.lastUpdated && 
                <>
                  <span>Last Updated: { clientInfoSnippet.lastUpdated.date }</span>
                  <span className="italicized-text">{ clientInfoSnippet.lastUpdated.time }</span>
                </>
              }
            </footer>
          </form>
      }

      { queryType === 'update' && clientInfoSnippet.cnmbr ?
        <Tabs>
          <TabList>
            <Tab>Properties</Tab>
            <Tab>Titles{titlesCount ? <span className="italicized-record-count">({titlesCount})</span>  : ''}</Tab>
          </TabList>

          <TabPanel>
            <SubTableProperties cnmbr={clientInfoSnippet.cnmbr} />
          </TabPanel>

          <TabPanel>
            <SubTableINS 
              inmbr={clientInfoSnippet.cnmbr} 
              setTitlesCount={setTitlesCount}
            />
          </TabPanel>
        </Tabs>
        : null
      }
    </div>
  );
}

export default ClientForm