import { 
  useForm, 
  // Controller 
} from "react-hook-form";
import { useRouter } from "next/router";
import FormInput from "../Common/FormInput/FormInput";
// import ComboBoxExample from "@/components/ComboBox/ComboBox";
import styles from './SearchPropertiesForm.module.scss'
import Button from "@/components/Button/Button";

interface SearchPropertiesFormProps {
  onSubmit: any;
  clientOptions: {CNAME: string}[];
  cityOptions: {PCITY:string}[];
  typeOptions: {PTYPE:string}[];
  statusOptions: {PSTAT:string}[];
}

const SearchPropertiesForm:React.FC<SearchPropertiesFormProps> = ({
  onSubmit,
  clientOptions,
  cityOptions,
  typeOptions,
  statusOptions,
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm();

  const router = useRouter()

  const handleViewAllClick = (e:any) => {
    e.preventDefault()
    router.push('/properties/1')
  }

  return (
    <div className={`form-wrapper ${styles['search-property-form']}`}>
        <header>
          <span>Search For Record</span>
        </header>
      <form 
        className="flex-y" 
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <section>
          <Controller 
            name={"downShift"}  
            control={control} 
            render={({ field }) => {
              console.log(field)
              return (
              <ComboBoxExample
                {...field}
                setValue={setValue}
                // options={props.languageOptionsToSelect}
              />
            )}}

          />
        </section> */}

        <section className="flex-x gap-sm">
          { cityOptions && cityOptions.length > 0 &&
            <FormInput 
              name="city"
              labelKey="city"
              labelText="City"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...cityOptions.map(city => city.PCITY)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          <FormInput 
            name="street"
            labelKey="street"
            labelText="Street"
            customClass='f-100'
            type="text" 
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="condo"
            labelKey="condo"
            labelText="Condo"
            customClass='f-50'
            type="text" 
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="lot"
            labelKey="lot"
            labelText="Lot"
            customClass='f-25'
            type="text" 
            isRequired={false}
            register={register} 
            errors={errors}
          />
        </section>

        <section className="flex-x gap-sm">
          { clientOptions && clientOptions.length > 0 &&
            <FormInput 
              name="client"
              labelKey="client"
              labelText="Client"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientOptions.map(client => client.CNAME)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { typeOptions && typeOptions.length > 0 &&
            <FormInput 
              name="type"
              labelKey="type"
              labelText="Type"
              customClass="f-25"
              type="select" 
              // @ts-ignore
              options={['', ...typeOptions.map(type => type.PTYPE)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { statusOptions && statusOptions.length > 0 &&
            <FormInput 
              name="status"
              labelKey="status"
              labelText="Status"
              customClass="f-25"
              type="select" 
              // @ts-ignore
              options={['', ...statusOptions.map(status => status.PSTAT)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

        </section>

        <FormInput 
          name="instructions"
          labelKey="instructions"
          labelText="Instructions"
          type="text" 
          isRequired={false}
          register={register} 
          errors={errors}
        />

        <section className={`flex-x ${styles['submit-button-section']}`}>
          <Button  
            isDisabled={!isDirty} 
            onClick={() => {}} 
            type='submit'            
          >
            Submit Search
          </Button>
          <Button 
            isDisabled={false} 
            type='button'
            onClick={handleViewAllClick} 
          >
            View All
          </Button>
        </section>
      </form>
    </div>
  );
}

export default SearchPropertiesForm