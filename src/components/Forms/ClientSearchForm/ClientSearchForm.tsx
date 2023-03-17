import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import FormInput from "../Common/FormInput/FormInput";
import { useClientsContext } from "@/context/Clients";
import Button from "@/components/Button/Button";
import { useState } from "react";

interface ClientSearchFormProps {
  onSubmit: any;
}

const ClientSearchForm:React.FC<ClientSearchFormProps> = ({
  onSubmit
}) => {
  const router = useRouter()

  const {clientSelectOptions} = useClientsContext()
  const [clearSelectInputBoxes, setClearSelectInputBoxes] = useState(false)

  const {
    CNAME: clientNames,
    CNMBR: clientNumbers,
    CSTAT: clientStats,
    CCNTCT: clientContacts,
    CSTATTO: clientStattos,
    CCITY: clientCities,
    CSTATE: clientStates,
    CZIP: clientZips,
    CPHONE: clientPhones,
    CFAX: clientFaxes,
    CEMAIL: clientEmails
  } = clientSelectOptions

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
    router.push('/clients/1')
  }

  return (
    <div className='form-wrapper search-form'>
        <header>
          <span>Search For Clients</span>
        </header>
      <form className="flex-y">
        <section className="flex-x gap-sm">
          { clientNames && clientNames.length > 0 &&
            <Controller 
              name={"clientName"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientName"
                    labelKey="clientName"
                    labelText="Name"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientNames}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientNumbers && clientNumbers.length > 0 &&
            <Controller 
              name={"clientNumber"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientNumber"
                    labelKey="clientNumber"
                    labelText="Number"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientNumbers}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientStats && clientStats.length > 0 &&
            <Controller 
              name={"clientStat"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientStat"
                    labelKey="clientStat"
                    labelText="Status"
                    type="select" 
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={clientStats}
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
          { clientPhones && clientPhones.length > 0 &&
            <Controller 
              name={"clientPhone"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientPhone"
                    labelKey="clientPhone"
                    labelText="Phone Number"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientPhones}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientFaxes && clientFaxes.length > 0 &&
            <Controller 
              name={"clientFax"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientFax"
                    labelKey="clientFax"
                    labelText="Fax Number"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientFaxes}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientEmails && clientEmails.length > 0 &&
            <Controller 
              name={"clientEmail"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientEmail"
                    labelKey="clientEmail"
                    labelText="Email"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientEmails}
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
          { clientContacts && clientContacts.length > 0 &&
            <Controller 
              name={"clientContact"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientContact"
                    labelKey="clientContact"
                    labelText="Contact"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientContacts}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientStattos && clientStattos.length > 0 &&
            <Controller 
              name={"clientStatementAddressee"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientStatementAddressee"
                    labelKey="clientStatementAddressee"
                    labelText="Statement Addressee"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientStattos}
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
          { clientCities && clientCities.length > 0 &&
            <Controller 
              name={"clientCity"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientCity"
                    labelKey="clientCity"
                    labelText="City"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientCities}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientStates && clientStates.length > 0 &&
            <Controller 
              name={"clientState"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientState"
                    labelKey="clientState"
                    labelText="State"
                    type="select" 
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={clientStates}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          }

          { clientZips && clientZips.length > 0 &&
            <Controller 
              name={"clientZip"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name="clientZip"
                    labelKey="clientZip"
                    labelText="Zip Code"
                    type="select" 
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientZips}
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

export default ClientSearchForm