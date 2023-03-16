import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCompaniesContext } from "@/context/Companies";
import { timestampToDate } from "@/utils";
import { abbreviatedStates } from "@/utils/UnitedStates";
import FormInput from "../Common/FormInput/FormInput";
import styles from './EditINSForm.module.scss'

interface EditINSFormFormProps {
  insTitleId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (propId: string) => void;
}

const EditINSFormForm:React.FC<EditINSFormFormProps> = ({
  insTitleId,
  queryType,
  handleAfterSubmit
}) => {

  const {companiesList} = useCompaniesContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [compRef, setCompRef] = useState(null)
  const [titlesCount, setTitlesCount] = useState(null)
  const [insTitleInfoSnippet, setInsTitleInfoSnippet] = useState<{
    id:string;
    inmbr: string | null;
    lastUpdated: {
      date:string, 
      time:string
    } | null;
  }>({
    id: 'New', 
    inmbr: 'New',
    lastUpdated: null
  })

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: async () => {
      if (insTitleId) {

        setIsLoading(true)
        
        const response = await axios.post('/api/titles/post-selected-title', {insTitleId})
        
        const {
          id='', LAST_UPDATED='', INMBR='', IFILE='', ICITY='', ISTATE='', IZIP='',
          ISTRET='', ILOT='', ICONDO='', IUNIT='', IPREMDUE='', IPREMPAID='', AGENTFEE='',
          ICDATE='', IPDATE='', IBILL='', IPOLDATE='', TITLECO='', ISTAT='', IREMIT='',
          P='', CNAME='', CFILE='', OPOLICYNUM='', OPOLICYAMT='', LPOLICYNUM='', LPOLICYAMT='', INOTES=''
        } = response.data[0]

        setInsTitleInfoSnippet((prevState) => ({
          ...prevState,
          id: id,
          inmbr: INMBR,
          lastUpdated: LAST_UPDATED ? timestampToDate(LAST_UPDATED, 'mmDDyyyy') : null
        }))
  
        setIsLoading(false)

        return {
          fileNumber: IFILE,
          city: ICITY,
          state: ISTATE,
          zip: IZIP,
          street: ISTRET,
          lot: ILOT,
          condo: ICONDO,
          unit: IUNIT,
          premiumDue: IPREMDUE,
          premiumPaid: IPREMPAID,
          agentFee: AGENTFEE,
          dateBilled: ICDATE,
          datePaid: IPDATE,
          billNumber: IBILL,
          policyDate: IPOLDATE,
          titleCompany: TITLECO,
          status: ISTAT,
          assigned: IREMIT,
          printed: P,
          clientName: CNAME,
          clientFileNumber: CFILE,
          oPolicyNumber: OPOLICYNUM,
          oPolicyAmount: OPOLICYAMT,
          lPolicyNumber: LPOLICYNUM,
          lPolicyAmount: LPOLICYAMT,
          notes: INOTES
        };
      }
    }
  });

  const onSubmit = (data:any) => console.log(data);

  return (
    <div className={`form-wrapper ${styles['manage-ins-form']}`}>
        <header>
          <span>3859 / Roxbury</span>
          <span>Title Number: 0001</span>
        </header>
      <form onSubmit={handleSubmit(onSubmit)}>

        <section className={`flex-x ${styles['top-section']}`}>
          <div className={`flex-y ${styles['column1']}`}>
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
            <div className="flex-x gap-sm city-state-zip-section">
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

          <div className={`flex-y ${styles['column2']}`}>
            <FormInput 
              name="premiumDue"
              labelKey="premiumDue"
              labelText="Premium Due"
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="premiumPaid"
              labelKey="premiumPaid"
              labelText="Premium Paid"
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="agentFee"
              labelKey="agentFee"
              labelText="Agent Fee"
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <div className={styles["input-placeholder"]}/>
          </div>

          <div className={`flex-y ${styles['column-3']}`}>
            <FormInput 
              name="dateBilled"
              labelKey="dateBilled"
              labelText="Date Billed"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="datePaid"
              labelKey="datePaid"
              labelText="Date Paid"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="billNumber"
              labelKey="billNumber"
              labelText="Bill #"
              min="0"
              type="number" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="policyDate"
              labelKey="policyDate"
              labelText="Policy Date"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>
        </section>

        <section className={`flex-y ${styles['mid-section']}`}>
          <div className={`flex-x ${styles['status-type-assigned-section']}`}>
            <FormInput 
              name="titleCompany"
              labelKey="titleCompany"
              labelText="Title Company"
              customClass={styles["title-company-select"]}
              type="select" 
              options={['', ...companiesList.map( company =>  company.tticoname)]}
              valuesDifferFromOptions={['', ...companiesList.map( company =>  company.tnmbr)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="status"
              labelKey="status"
              labelText="Status"
              type="select" 
              options={['', 'C', 'O']}
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              name="assigned"
              labelKey="assigned"
              labelText="Assigned"
              type="select" 
              options={['', 'Y', 'N']}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="printed"
              labelKey="printed"
              labelText="Printed"
              type="select" 
              options={['', 'Y', 'N']}
              isRequired={false}
              register={register} 
              errors={errors}
            />
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

          <div className={`flex-x ${styles['opolicy-section']}`}>
            <FormInput 
              name="oPolicyNumber"
              labelKey="oPolicyNumber"
              labelText="O Policy #"
              customClass={styles.oPolicyNumber}
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              name="oPolicyAmount"
              labelKey="oPolicyAmount"
              labelText="O Policy Amount"
              customClass={styles.oPolicyAmount}
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>

          <div className={`flex-x ${styles['lpolicy-section']}`}>
            <FormInput 
              name="lPolicyNumber"
              labelKey="lPolicyNumber"
              labelText="L Policy #"
              customClass={styles.lPolicyNumber}
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              name="lPolicyAmount"
              labelKey="lPolicyAmount"
              labelText="L Policy Amount"
              customClass={styles.lPolicyAmount}
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>
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

        <section className={styles["submit-button-section"]}>
          <input className={styles["submit-button"]} type="submit" />
        </section>
      </form>
    </div>
  );
}

export default EditINSFormForm