import { abbreviatedStates } from "@/utils/UnitedStates";
import { useForm } from "react-hook-form";
import FormInput from "../Common/FormInput/FormInput";
import styles from './INSForm.module.scss'

export default function INSForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

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
            <div className="flex-x city-state-zip-section">
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
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="status"
              labelKey="status"
              labelText="Status"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              name="assigned"
              labelKey="assigned"
              labelText="Assigned"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="printed"
              labelKey="printed"
              labelText="Printed"
              type="select" 
              options={['get', 'from', 'DB']}
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
