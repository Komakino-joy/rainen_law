import { abbreviatedStates } from "@/utils/UnitedStates";
import { useForm } from "react-hook-form";
import FormInput from "../Common/FormInput/FormInput";
import './INSForm.scss'

export default function INSForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = (data:any) => console.log(data);

  return (
    <div id='manage-ins-form' className='form-wrapper'>
        <header>
          <span>3859 / Roxbury</span>
          <span>Title Number: 0001</span>
        </header>
      <form onSubmit={handleSubmit(onSubmit)}>

        <section className="flex-x top-section">
          <div className="flex-y column-1">
            <FormInput 
              labelKey="fileNumber"
              labelText="File #"
              customClass='fileNumber'
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />
            <div className="flex-x city-state-zip-section">
              <FormInput 
                labelKey="city"
                labelText="City"
                customClass='city'
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                labelKey="state"
                labelText="State"
                customClass='state'
                type="select" 
                options={abbreviatedStates}
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                labelKey="zip"
                labelText="Zip Code"
                customClass='zip'
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />
            </div>

            <FormInput 
              labelKey="street"
              labelText="Street"
              customClass='street'
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <div className="flex-x lot-condo-unit-section">
              <FormInput 
                labelKey="lot"
                labelText="Lot"
                customClass='lot'
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
              <FormInput 
                labelKey="condo"
                labelText="Condo"
                customClass='condo'
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />

              <FormInput 
                labelKey="unit"
                labelText="Unit"
                customClass='unit'
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
            </div>
          </div>

          <div className="flex-y column-2">
            <FormInput 
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

            <div className="input-placeholder"/>
          </div>

          <div className="flex-y column-3">
            <FormInput 
              labelKey="dateBilled"
              labelText="Date Billed"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="datePaid"
              labelText="Date Paid"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="billNumber"
              labelText="Bill #"
              min="0"
              type="number" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="policyDate"
              labelText="Policy Date"
              type="date" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>
        </section>

        <section className="flex-y mid-section">
          <div className="flex-x status-type-assigned-section">
            <FormInput 
              labelKey="titleCompany"
              labelText="Title Company"
              customClass="title-company-select"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="status"
              labelText="Status"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              labelKey="assigned"
              labelText="Assigned"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="printed"
              labelText="Printed"
              type="select" 
              options={['get', 'from', 'DB']}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>

          <div className="flex-x comp-ref-file-num-section">
            <FormInput 
              labelKey="clientName"
              labelText="Interpolate ID"
              customClass="clientName"
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput 
              labelKey="clientFileNumber"
              labelText="Client's File #"
              customClass="clientFileNumber"
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />
          </div>

          <div className="flex-x opolicy-section">
            <FormInput 
              labelKey="oPolicyNumber"
              labelText="O Policy #"
              customClass="oPolicyNumber"
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              labelKey="oPolicyAmount"
              labelText="O Policy Amount"
              customClass="oPolicyAmount"
              type="number" 
              min="0.01" 
              step="0.01" 
              max="2500000"
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>

          <div className="flex-x lpolicy-section">
            <FormInput 
              labelKey="lPolicyNumber"
              labelText="L Policy #"
              customClass="lPolicyNumber"
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
            
            <FormInput 
              labelKey="lPolicyAmount"
              labelText="L Policy Amount"
              customClass="lPolicyAmount"
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

        <section className='notes-section'>
          <FormInput 
            labelKey="notes"
            labelText="Notes"
            type="textarea" 
            isRequired={false}
            register={register} 
            errors={errors}
          />
        </section>

        <section className="submit-button-section">
          <input className="submit-button" type="submit" />
        </section>
      </form>
    </div>
  );
}
