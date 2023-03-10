import { useForm } from "react-hook-form";
import { abbreviatedStates } from "@/utils/UnitedStates";
import FormInput from "../Common/FormInput/FormInput";
import './ClientForm.scss'
import '../Common/Forms.common.scss'

export default function ClientForm() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm();

  const onSubmit = (data:any) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
      <div id='manage-client-form' className='form-wrapper'>
      <header>
        <span>---- Client/Firm Name ----</span>
        <span> Client Number 999999</span>
      </header>
      <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
        <section className="flex-x client-status-section">
          <FormInput 
            customClass="client"
            labelKey="client-firm-name"
            labelText="Client/Firm Name"
            type="text"
            isRequired={true}
            register={register} 
            errors={errors}
          />
          <FormInput 
            customClass="status"
            labelKey="status"
            labelText="Status"
            type="select" 
            isRequired={true}
            register={register} 
            options={['C','O']}
            errors={errors}
          />
        </section>

        <FormInput 
          labelKey="search-name"
          labelText="Search Name"
          type="text"
          isRequired={true}
          register={register} 
          errors={errors}
        />

        <FormInput 
          labelKey="address-line-1"
          labelText="Address Line 1"
          type="text" 
          isRequired={true}
          register={register} 
          errors={errors}
        />

        <FormInput 
          labelKey="address-line-2"
          labelText="Address Line 2"
          type="text" 
          isRequired={false}
          register={register} 
          errors={errors}
        />

        <section className="flex-x city-state-zip-section">
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
        </section>

        <section className='flex-x phone-fax-email-section'>
          <FormInput 
            labelKey="phone"
            labelText="Phone Number"
            customClass='phone'
            type="tel" 
            isRequired={true}
            register={register} 
            errors={errors}
          />

          <FormInput 
            labelKey="fax"
            labelText="Fax Number"
            customClass='fax'
            type="tel" 
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            labelKey="email"
            labelText="Email Address"
            customClass='email'
            type="email" 
            isRequired={false}
            register={register} 
            errors={errors}
          />
        </section>

        <section className='flex-x contact-statement-section'>
          <FormInput 
            labelKey="contact"
            labelText="Contact"
            customClass='contact'
            type="text" 
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            labelKey="statementAddressee"
            labelText="Statement Addressee"
            customClass='statement'
            type="text" 
            isRequired={false}
            register={register} 
            errors={errors}
          />
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
