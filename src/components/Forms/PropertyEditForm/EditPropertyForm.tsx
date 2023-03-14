import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import 'react-tabs/style/react-tabs.css';

import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";

import { timestampToDate, abbreviatedStates } from "@/utils";
import { usePropertiesContext } from "@/context/Properties";
import styles from './EditPropertyForm.module.scss'
import PropertyEditFormTabs from "@/components/Tabs/PropertyEditFormTabs";

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

  const {assignOptions, typeOptions, statusOptions} = usePropertiesContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [propertyHeader, setPropertyHeader] = useState<{id:string, address:string}>({id: 'New', address: 'New'})
  const [clientOptions, setClientOptions] = useState([])
  const [lastUpdated, setLastedUpdated] = useState<{date:string, time:string} | null>(null)
  const [compRef, setCompRef] = useState(0)

  const submitText = {
    update: 'Update',
    insert: 'Create'
  }

  useEffect(() => {
    (async() => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/get-all-clients`)
      setClientOptions(response.data)
    })();


    if(queryType === 'insert') (async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/get-new-comp-ref`)
        setCompRef(response.data.newCompRef)
      })();
    
  },[])

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty },
    reset,
  } = useForm({
      defaultValues: async () => {
        if (propertyId) {

          setIsLoading(true)
          
          const response = await axios.post('/api/properties/post-selected-property', {propertyId})
          
          const {
            PROPID='', PCITY='', PSTRET='', PSTATE='', PZIP='', 
            PBOOK1='', PBOOK2='', PDOCNUM='', PPAGE1='', PPAGE2='',
            PCERT1='', PLOT='', PCONDO='', PUNIT='', PSTAT='', PTYPE='', 
            PASIGN='', CNAME='', PCOMPREF='', PFILE='', CFILE='', 
            PREQ='', PRDATE='', PCDATE='', PINSTR='', LAST_UPDATED
          } = response.data[0]
    
          if (LAST_UPDATED) setLastedUpdated(timestampToDate(LAST_UPDATED, 'mmDDyyyy'))

          setPropertyHeader({
            id: PROPID,
            address: `${PCITY} / ${PSTRET}`,
          })
    
          setIsLoading(false)

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
            status: PSTAT ,
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

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    
    if(queryType === 'insert') {
      const response = await axios.post(`/api/properties/post-add-property`, data)
      reset()
      handleAfterSubmit(response.data.newPropId)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/properties/post-update-property`, {id: propertyHeader.id, ...data})
      handleAfterSubmit(propertyHeader.id)
      reset(response.data.updatedRecord)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }
  };

  return (
    <div className={`form-wrapper ${styles['manage-property-form']}`}>
        <header>
          <span>{propertyHeader.address}</span>
          <span>PROPID: {propertyHeader.id}</span>
        </header>
      { isLoading ? <h4>Loading...</h4>
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

                <FormInput 
                  name="state"
                  labelKey="state"
                  labelText="State"
                  customClass={styles.state}
                  type="select" 
                  options={abbreviatedStates}
                  isRequired={true}
                  register={register} 
                  errors={errors}
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
                <FormInput 
                  name="status"
                  labelKey="status"
                  labelText="Status"
                  type="select" 
                  options={['',...statusOptions.map(type => type.PSTAT)]}
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />
              }
                
              { typeOptions && typeOptions.length > 0 && 
                <FormInput 
                  name="type"
                  labelKey="type"
                  labelText="Type"
                  type="select" 
                  options={['', ...typeOptions.map(type => type.PTYPE)]}
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />
              }
              
              { assignOptions && assignOptions.length > 0 &&                
                <FormInput 
                  name="assigned"
                  labelKey="assigned"
                  labelText="Assigned"
                  type="select" 
                  options={['', ...assignOptions.map(type => type.PASIGN)]}
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />
              }
            </div>

            <div className={`flex-x ${styles['comp-ref-file-num-section']}`}>
              { clientOptions && clientOptions.length > 0 &&
                <FormInput 
                  name="clientName"
                  labelKey="clientName"
                  labelText="Client Name"
                  customClass={styles.clientName}
                  type="select" 
                  options={['', ...clientOptions.map((client: {CNAME:string}) => client.CNAME)]}
                  isRequired={true}
                  register={register} 
                  errors={errors}
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

          <section className={styles["submit-button-section"]}>
            <Button type="submit" isDisabled={!isDirty}>
              {submitText[queryType]} 
            </Button>
          </section>

        </form>
      }
      <footer className="form-footer">
        { lastUpdated && 
          <>
            <span>Last Updated: {lastUpdated.date}</span>
            <span className="italicized-text">{lastUpdated.time}</span>
          </>
        }
      </footer>

      <PropertyEditFormTabs 
      
      />
    </div>
  );
}


export default EditPropertyForm;