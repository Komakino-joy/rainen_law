
import { timestampToDate, abbreviatedStates } from "@/utils";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../Common/FormInput/FormInput";
import styles from './PropertyForm.module.scss'

interface PropertyFormProps {
  propertyId: string | null;
  typeOptions: {PTYPE:string}[];
  statusOptions: {PSTAT:string}[];
  assignOptions: {PASIGN:string}[];
}

const PropertyForm:React.FC<PropertyFormProps> = ({
  propertyId,
  statusOptions,
  typeOptions,
  assignOptions
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [propertyHeader, setPropertyHeader] = useState<{id:string, address:string}>({id: 'New', address: 'New'})

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      setIsLoading(true)
      const response = await axios.post('/api/properties/post-selected-property', {propertyId})
      
      const {
        PROPID='', PCITY='', PSTRET='', PSTATE='', PZIP='', 
        PBOOK1='', PBOOK2='', PDOCNUM='', PPAGE1='', PPAGE2='',
        PCERT1='', PLOT='', PCONDO='', PUNIT='', PSTAT='', PTYPE='', 
        PASIGN='', CNAME='', PCOMPREF='', PFILE='', CFILE='', 
        PREQ='', PRDATE='', PCDATE='', PINSTR=''
      } = response.data[0]

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
        client:  CNAME,
        compRef: PCOMPREF ,
        fileNumber: PFILE ,
        clientFileNumber: CFILE ,
        requester: PREQ ,
        requestDate: timestampToDate(PRDATE) ,
        closedDate: timestampToDate(PCDATE) ,
        instructions: PINSTR 
      };
    }
  });

  const onSubmit = (data:any) => console.log(data);

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
              <FormInput 
                name="clientName"
                labelKey="clientName"
                labelText="Interpolate ID"
                customClass={styles.clientName}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="compRef"
                labelKey="compRef"
                labelText="Comp Ref"
                customClass={styles.compRef}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
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
            <input className={styles["submit-button"]} type="submit" />
          </section>
        </form>
      }
    </div>
  );
}


export default PropertyForm;