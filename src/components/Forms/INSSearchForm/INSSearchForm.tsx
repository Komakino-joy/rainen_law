import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import FormInput from "../Common/FormInput/FormInput";
import { useClientsContext } from "@/context/Clients";
import Button from "@/components/Button/Button";
import { useState } from "react";
import { useINSTitlesContext } from "@/context/INSTitles";

interface INSSearchFormProps {
  onSubmit: any;
}

const INSSearchForm:React.FC<INSSearchFormProps> = ({
  onSubmit
}) => {
  const router = useRouter()

  const {insTitleSelectOptions} = useINSTitlesContext()
  const {
    tticoname: titleCompanies,
    INMBR: titleNumbers,
    ICITY: titleCities,
    ISTATE: titleStates,
    IZIP: titleZipCodes,
    ISTAT: titleStats
  } = insTitleSelectOptions

  const [clearSelectInputBoxes, setClearSelectInputBoxes] = useState(false)
  
  const { 
    register, 
    reset,
    control,
    formState,
    getValues
  } = useForm();

  const { errors, dirtyFields } = formState

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const handleViewAllClick = (e:any) => {
    e.preventDefault()
    router.push('/ins-titles/1')
  }

  return (
    <div className='form-wrapper search-form'>
        <header>
          <span>Search For Insurance Titles</span>
        </header>
      <form className="flex-y" >
        <section className="flex-x jc-between pr-8">
          <FormInput 
            name="fileNumber"
            labelKey="fileNumber"
            labelText="File Number"
            type="text"
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <div className='flex-x gap-md date-inputs'>
            <FormInput 
              name="createdAtStartDate"
              labelKey="createdAtStartDate"
              labelText="Created At Start Date"
              type="date"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="createdAtEndDate"
              labelKey="createdAtEndDate"
              labelText="Created At End Date"
              type="date"
              isRequired={false}
              register={register} 
              errors={errors}
            />
          </div>
        </section>
        <section className='flex-x gap-md date-inputs'>
          <FormInput 
            name="oPolicyNum"
            labelKey="oPolicyNum"
            labelText="O Policy Number"
            type="text"
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="lPolicyNum"
            labelKey="lPolicyNum"
            labelText="L Policy Number"
            type="text"
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="policyStartDate"
            labelKey="policyStartDate"
            labelText="Policy Start Date"
            type="date"
            isRequired={false}
            register={register} 
            errors={errors}
          />

          <FormInput 
            name="policyEndDate"
            labelKey="policyEndDate"
            labelText="Policy End Date"
            type="date"
            isRequired={false}
            register={register} 
            errors={errors}
          />
        </section>
        <section className="flex-x gap-sm">
          { titleCompanies && titleCompanies.length > 0 &&
            <Controller 
              name={"titleCompanyName"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleCompanyName"
                    labelKey="titleCompanyName"
                    labelText="Title Company Name"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={titleCompanies}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { titleNumbers && titleNumbers.length > 0 &&
            <Controller 
              name={"titleNumber"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleNumber"
                    labelKey="titleNumber"
                    labelText="Title Number"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={titleNumbers}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { titleStats && titleStats.length > 0 &&
            <Controller 
              name={"titleStatus"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleStatus"
                    labelKey="titleStatus"
                    labelText="Status"
                    type="select" 
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={titleStats}
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
          { titleCities && titleCities.length > 0 &&
            <Controller 
              name={"titleCity"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleCity"
                    labelKey="titleCity"
                    labelText="City"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={titleCities}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { titleStates && titleStates.length > 0 &&
            <Controller 
              name={"titleState"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleState"
                    labelKey="titleState"
                    labelText="State"
                    type="select" 
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={titleStates}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { titleZipCodes && titleZipCodes.length > 0 &&
            <Controller 
              name={"titleZip"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="titleZip"
                    labelKey="titleZip"
                    labelText="Zip Code"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={titleZipCodes}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }
        </section>

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
            onClick={(e) => {
              e.preventDefault()
              const data = getValues()
              onSubmit(data)
              setClearSelectInputBoxes(!clearSelectInputBoxes)
              reset()
            }}
            type='button'            
          >
            Submit Search
          </Button>
          <Button 
            isDisabled={isDirtyAlt} 
            type='button'
            onClick={() => {
              setClearSelectInputBoxes(!clearSelectInputBoxes)
              reset()
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

export default INSSearchForm