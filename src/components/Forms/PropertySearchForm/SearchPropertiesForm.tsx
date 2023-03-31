import { 
  useForm, 
  Controller 
} from "react-hook-form";
import { useRouter } from "next/router";
import FormInput from "../Common/FormInput/FormInput";
import { useClientsContext } from "@/context/Clients";
import { usePropertiesContext } from "@/context/Properties";
import Button from "@/components/Button/Button";
import { useState } from "react";

interface SearchPropertiesFormProps {
  onSubmit: any;
}

const SearchPropertiesForm:React.FC<SearchPropertiesFormProps> = ({
  onSubmit
}) => {
  const router = useRouter()

  const { propertiesSelectOptions} = usePropertiesContext()
  const {clientSelectOptions} = useClientsContext()

  const [clearSelectInputBoxes, setClearSelectInputBoxes] = useState(false)

  const { 
    register, 
    getValues,
    reset,
    control,
    formState: { errors, dirtyFields }
  } = useForm();

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const handleViewAllClick = (e:any) => {
    e.preventDefault()
    router.push('/properties/1')
  }

  return (
    <div className='form-wrapper search-form'>
        <header>
          <span>Search For Properties</span>
        </header>
      <form className="flex-y">
        <section className="flex-x gap-sm">
          <FormInput 
            name="compRef"
            labelKey="compRef"
            labelText="CompRef"
            type="text" 
            isRequired={true}
            register={register} 
            errors={errors}
          />
          <FormInput 
            name="fileNumber"
            labelKey="fileNumber"
            labelText="FileNumber"
            type="text" 
            isRequired={true}
            register={register} 
            errors={errors}
          />
          <FormInput 
            name="inputStartDate"
            labelKey="inputStartDate"
            labelText="Input Start Date"
            type="date"
            isRequired={true}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="inputEndDate"
            labelKey="inputEndDate"
            labelText="Input End Date"
            type="date"
            isRequired={true}
            register={register} 
            errors={errors}
          />
          
          <FormInput 
            name="requestStartDate"
            labelKey="requestStartDate"
            labelText="Request Start Date"
            type="date"
            isRequired={true}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="requestEndDate"
            labelKey="requestEndDate"
            labelText="Request End Date"
            type="date"
            isRequired={true}
            register={register} 
            errors={errors}
          />
        </section>
        <section className="flex-x gap-sm">
          { clientSelectOptions.CNAME && clientSelectOptions.CNAME.length > 0 &&
            <Controller 
              name={"client"}  
              control={control} 
              render={({
                field: { onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="client"
                    labelKey="client"
                    labelText="Client"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientSelectOptions.CNAME}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { propertiesSelectOptions.PTYPE && propertiesSelectOptions.PTYPE.length > 0 &&
            <Controller 
              name={"type"}  
              control={control} 
              render={({
                field: { onChange},
              }) => {
                return (
                  <FormInput 
                    name="type"
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    labelKey="type"
                    labelText="Type"
                    type="select" 
                    customClass="f-25"
                    selectOnChange={onChange}
                    options={propertiesSelectOptions.PTYPE}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }
          
          { propertiesSelectOptions.PSTAT && propertiesSelectOptions.PSTAT.length > 0 &&
            <Controller 
              name={"status"}  
              control={control} 
              render={({
                field: { onChange},
              }) => {
                return (
                  <FormInput 
                    name="status"
                    labelKey="status"
                    labelText="Status"
                    type="select" 
                    customClass="f-25"
                    selectOnChange={onChange}
                    options={propertiesSelectOptions.PSTAT}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

        </section>
        <section className="flex-x gap-sm">
        { propertiesSelectOptions.PCITY && propertiesSelectOptions.PCITY.length > 0 &&
            <Controller 
              name={"city"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="city"
                    labelKey="city"
                    labelText="City"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={propertiesSelectOptions.PCITY}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
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

        <FormInput 
          name="instructions"
          labelKey="instructions"
          labelText="Instructions"
          type="text" 
          isRequired={false}
          register={register} 
          errors={errors}
        />

        <section className='flex-x submit-button-section'>
          <Button 
            isDisabled={false} 
            type='button'
            onClick={handleViewAllClick} 
          >
            View All
          </Button>
          <Button  
            isDisabled={isDirtyAlt} 
            type='button'            
            onClick={(e) => {
              e.preventDefault()
              const data = getValues()
              onSubmit(data)
              setClearSelectInputBoxes(!clearSelectInputBoxes)
              reset()
            }}
          >
            Submit Search
          </Button>
          <Button 
            isDisabled={isDirtyAlt} 
            type='button'
            onClick={() => {
              reset()
              setClearSelectInputBoxes(!clearSelectInputBoxes)
            }} 
            redVariant
          >
            Clear Form
          </Button>
        </section>
      </form>
    </div>
  );
}

export default SearchPropertiesForm