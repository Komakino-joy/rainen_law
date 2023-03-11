import { useForm } from "react-hook-form";
import { abbreviatedStates } from "@/utils/UnitedStates";
import FormInput from "../Common/FormInput/FormInput";
import styles from './ClientForm.module.scss'

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
      <div className={`${styles['manage-client-form']} form-wrapper`}>
      <header>
        <span>---- Client/Firm Name ----</span>
        <span> Client Number 999999</span>
      </header>
      <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
        <section className={`flex-x ${styles['client-status-section']}`}>
          <FormInput 
            name="client"
            customClass={styles.client}
            labelKey="client-firm-name"
            labelText="Client/Firm Name"
            type="text"
            isRequired={true}
            register={register} 
            errors={errors}
          />
          <FormInput 
            name="status"
            customClass={styles.status}
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
          name="search-name"
          labelKey="search-name"
          labelText="Search Name"
          type="text"
          isRequired={true}
          register={register} 
          errors={errors}
        />

        <FormInput 
          name="address-line-1"
          labelKey="address-line-1"
          labelText="Address Line 1"
          type="text" 
          isRequired={true}
          register={register} 
          errors={errors}
        />

        <FormInput
          name="address-line-2" 
          labelKey="address-line-2"
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

        <section className={styles["submit-button-section"]}>
          <input className={styles["submit-button"]} type="submit" />
        </section>
      </form>
    </div>
  );
}
