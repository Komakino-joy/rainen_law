import { Client, ClientInfoSnippet, DateTime } from "@/types/common";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { 
  httpPostInsertClient, 
  httpPostSelectedClient, 
  httpPostUpdateClient 
} from "@/services/http";

import { ClientStatusCodeMapType, CLIENT_STATUS_CODES_MAP, FORM_BUTTON_TEXT } from "@/constants";
import { timestampToDate } from "@/utils";
import { abbreviatedStatesLabelValuePair } from "@/utils/UnitedStates";
import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";
import SubTableINS from "@/components/Tables/SubTableINS/SubTableINS";
import SubTableProperties from "@/components/Tables/SubTableProperties/SubTableProperties";
import styles from './EditClientForm.module.scss'
import Spinner from "@/components/Spinner/Spinner";
import PrintClientLabel from "@/components/PrintClientLabel/PrintClientLabel";
import { useSelectDropDownsContext } from "@/context/SelectDropDowns";
import { useAuth } from "@/context/AuthContext";
import dbRef from "@/constants/dbRefs";

interface EditClientFormProps {
  clientId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (id: string) => void;
}

const ClientForm:React.FC<EditClientFormProps> = ({
  clientId,
  queryType, 
  handleAfterSubmit = () => {},
}) => {
  const {user} = useAuth()
  const {clientStatusDropDownOptions} = useSelectDropDownsContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [titlesCount, setTitlesCount] = useState(null)
  const [printLabelInfo, setPrintLabelInfo] = useState({})
  const [defaultSelectValues , setDefaultSelectValues] = useState({
    [dbRef.clients.c_status]: '',
    [dbRef.clients.c_state]: 'MA'
  })
  const [clientInfoSnippet, setClientInfoSnippet] = useState<ClientInfoSnippet>({
    [dbRef.clients.id]: 'New', 
    [dbRef.clients.c_number]: null,
    [dbRef.clients.c_name]: 'New Client',
    [dbRef.clients.last_updated]: null
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
        
        const clientInfo = await httpPostSelectedClient({id: clientId})
        
        const {
          id='', c_number='', c_name='', last_updated=null, c_status='', c_address_1='', 
          c_address_2='', c_city='', c_state='', c_zip='', c_phone='',
          c_fax='', c_email='', c_contact='', c_statement_addresse='', c_notes=''
        } = clientInfo

        setPrintLabelInfo((prevState) => ({
          ...prevState,
          c_name,
          c_address_1,
          c_address_2,
          c_city,
          c_state,
          c_zip
        }))

        setClientInfoSnippet((prevState) => ({
          ...prevState,
          [dbRef.clients.id]: id,
          [dbRef.clients.c_number]: c_number.toString(),
          [dbRef.clients.c_name]: c_name,
          [dbRef.clients.last_updated]: last_updated ? timestampToDate(last_updated, 'mmDDyyyy') : null
        }))
  
        setIsLoading(false)

        setDefaultSelectValues({
          [dbRef.clients.c_status]: CLIENT_STATUS_CODES_MAP[c_status as ClientStatusCodeMapType] || '',
          [dbRef.clients.c_state]: c_state || ''
        })

        return {
          [dbRef.clients.c_name]: c_name ,
          [dbRef.clients.c_status]: c_status ,
          [dbRef.clients.c_address_1]: c_address_1 ,
          [dbRef.clients.c_address_2]: c_address_2 ,
          [dbRef.clients.c_city]: c_city ,
          [dbRef.clients.c_state]: c_state ,
          [dbRef.clients.c_zip]: c_zip ,
          [dbRef.clients.c_phone]: c_phone ,
          [dbRef.clients.c_fax]: c_fax ,
          [dbRef.clients.c_email]: c_email ,
          [dbRef.clients.c_contact]: c_contact ,
          [dbRef.clients.c_statement_addresse]: c_statement_addresse ,
          [dbRef.clients.c_notes]: c_notes  
        };
      }
    }
  });

  const onSubmit = async(data:any) => {
    if(!isDirty) {
      return 
    }  else {
      if(queryType === 'insert') {
        const newClientId = await httpPostInsertClient({
          data,
          username: user.username
        })
  
        reset()
        handleAfterSubmit(newClientId)
      }
  
      if(queryType === 'update') {
        const updatedRecord = httpPostUpdateClient({
          data,
          id: clientInfoSnippet[dbRef.clients.id as ClientInfoKeys ], // Passing id to update correct record
          username: user.username,
        })
  
        handleAfterSubmit(clientInfoSnippet[dbRef.clients.id as ClientInfoKeys ])
        reset(updatedRecord)
      }
    }
  };

  type ClientInfoKeys = keyof typeof clientInfoSnippet

  return (
    <div className='form-wrapper edit-form'>
      <header>
        <span>{clientInfoSnippet[dbRef.clients.c_name as  ClientInfoKeys]}</span>
        { clientInfoSnippet[dbRef.clients.c_number as  ClientInfoKeys] ?
            <span> Client Number: {clientInfoSnippet[dbRef.clients.c_number as  ClientInfoKeys]} </span>
          : null
        }
      </header>
      { isLoading ? <Spinner />
        : <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
            <section className={`flex-x ${styles['client-status-section']}`}>
              <FormInput 
                name={dbRef.clients.c_name}
                customClass={styles.client}
                labelKey={dbRef.clients.c_name}
                labelText="Client/Firm Name"
                type="text"
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <Controller 
                name={dbRef.clients.c_status}  
                control={control} 
                rules={{ required: true }}
                render={({
                  field: {onChange},
                }) => {
                  return (
                    <FormInput 
                      name={dbRef.clients.c_status} 
                      labelKey={dbRef.clients.c_status} 
                      labelText="Status"
                      type="select" 
                      defaultValue={defaultSelectValues.status}
                      customClass={styles.status}
                      selectOnChange={onChange}
                      options={clientStatusDropDownOptions}
                      isRequired={true}
                      register={register} 
                      errors={errors}
                    />
                  ) 
                }}
              />
            </section>
            <section className={styles['address-section']}>
              <FormInput 
                name={dbRef.clients.c_address_1} 
                labelKey={dbRef.clients.c_address_1} 
                labelText="Address Line 1"
                type="text" 
                customClass={styles.address}
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput
                name={dbRef.clients.c_address_2}  
                labelKey={dbRef.clients.c_address_2} 
                labelText="Address Line 2"
                type="text" 
                customClass={styles.address}
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </section>

            <section className={`flex-x ${styles['city-state-zip-section']}`}>
              <FormInput 
                name={dbRef.clients.c_city} 
                labelKey={dbRef.clients.c_city} 
                labelText="City"
                customClass={styles.city}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <Controller 
                  name={dbRef.clients.c_state}   
                  control={control} 
                  rules={{ required: true }}
                  defaultValue={defaultSelectValues.state}
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name={dbRef.clients.c_state} 
                        labelKey={dbRef.clients.c_state} 
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
                name={dbRef.clients.c_zip} 
                labelKey={dbRef.clients.c_zip} 
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
                name={dbRef.clients.c_phone} 
                labelKey={dbRef.clients.c_phone} 
                labelText="Phone Number"
                customClass={styles.phone}
                type="tel" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.clients.c_fax} 
                labelKey={dbRef.clients.c_fax} 
                labelText="Fax Number"
                customClass={styles.fax}
                type="tel" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.clients.c_email} 
                labelKey={dbRef.clients.c_email} 
                labelText="Email Address"
                customClass={styles.email}
                type="email" 
                isRequired={true}
                register={register} 
                errors={errors}
              />
            </section>

            <section className={`flex-x ${styles['contact-statement-section']}`}>
              <FormInput 
                name={dbRef.clients.c_contact} 
                labelKey={dbRef.clients.c_contact} 
                labelText="Contact"
                customClass={styles.contact}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name={dbRef.clients.c_statement_addresse} 
                labelKey={dbRef.clients.c_statement_addresse} 
                labelText="Statement Addressee"
                customClass={styles.statement}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />
            </section>


            <section className={styles['notes-section']}>
              <FormInput 
                name={dbRef.clients.c_notes} 
                labelKey={dbRef.clients.c_notes} 
                labelText="Notes"
                type="textarea" 
                isRequired={true}
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
              { clientInfoSnippet[dbRef.clients.last_updated as ClientInfoKeys ] && 
                <>
                  <span>Last Updated: {(clientInfoSnippet[dbRef.clients.last_updated as ClientInfoKeys ] as DateTime).date}</span>
                  <span className="italicized-text">{(clientInfoSnippet[dbRef.clients.last_updated as ClientInfoKeys ] as DateTime).time}</span>
                </>
              }
            </footer>
          </form>
      }

      { queryType === 'update' && clientInfoSnippet[dbRef.clients.c_number as ClientInfoKeys ] ?
        <Tabs>
          <TabList>
            <Tab>Properties</Tab>
            <Tab>Titles{titlesCount ? <span className="italicized-record-count">({titlesCount})</span>  : ''}</Tab>
          </TabList>

          <TabPanel>
            <SubTableProperties cnmbr={(clientInfoSnippet[dbRef.clients.c_number as ClientInfoKeys] as string).toString()} />
          </TabPanel>

          <TabPanel>
            <SubTableINS 
              inmbr={(clientInfoSnippet[dbRef.clients.c_number as ClientInfoKeys] as string).toString()} 
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