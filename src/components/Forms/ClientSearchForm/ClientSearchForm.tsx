import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import FormInput from "../Common/FormInput/FormInput";
import { useClientsContext } from "@/context/Clients";
import Button from "@/components/Button/Button";

interface ClientSearchFormProps {
  onSubmit: any;
}

const ClientSearchForm:React.FC<ClientSearchFormProps> = ({
  onSubmit
}) => {

  const {clientsData} = useClientsContext()
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
  } = clientsData

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isDirty }
  } = useForm();

  const router = useRouter()

  const handleViewAllClick = (e:any) => {
    e.preventDefault()
    router.push('/clients/1')
  }

  return (
    <div className='form-wrapper search-form'>
        <header>
          <span>Search For Clients</span>
        </header>
      <form 
        className="flex-y" 
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="flex-x gap-sm">
          { clientNames && clientNames.length > 0 &&
            <FormInput 
              name="clientName"
              labelKey="clientName"
              labelText="Name"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientNames.map(clientName => clientName)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientNumbers && clientNumbers.length > 0 &&
            <FormInput 
              name="clientNumber"
              labelKey="clientNumber"
              labelText="Number"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientNumbers.map(clientNumber => clientNumber)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientStats && clientStats.length > 0 &&
            <FormInput 
              name="clientStat"
              labelKey="clientStat"
              labelText="Status"
              type="select" 
              customClass="f-50"
              // @ts-ignore
              options={['', ...clientStats.map(clientStat => clientStat)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }
        </section>

        <section className="flex-x gap-sm">
        { clientPhones && clientPhones.length > 0 &&
            <FormInput 
              name="clientPhone"
              labelKey="clientPhone"
              labelText="Phone Number"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientPhones.map(clientPhone => clientPhone)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientFaxes && clientFaxes.length > 0 &&
            <FormInput 
              name="clientFax"
              labelKey="clientFax"
              labelText="Fax Number"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientFaxes.map(clientFax => clientFax)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientEmails && clientEmails.length > 0 &&
            <FormInput 
              name="clientEmail"
              labelKey="clientEmail"
              labelText="Email"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientEmails.map(clientEmail => clientEmail)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }
        </section>

        <section className="flex-x gap-sm">
          { clientContacts && clientContacts.length > 0 &&
            <FormInput 
              name="clientContact"
              labelKey="clientContact"
              labelText="Contact"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientContacts.map(contact => contact)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientStattos && clientStattos.length > 0 &&
            <FormInput 
              name="clientStatementAddressee"
              labelKey="clientStatementAddressee"
              labelText="Statement Addressee"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientStattos.map(statto => statto)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }
        </section>

        <section className="flex-x gap-sm">
          { clientCities && clientCities.length > 0 &&
            <FormInput 
              name="clientCity"
              labelKey="clientCity"
              labelText="City"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientCities.map(city => city)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientStates && clientStates.length > 0 &&
            <FormInput 
              name="clientState"
              labelKey="clientState"
              labelText="State"
              type="select" 
              customClass="f-50"
              // @ts-ignore
              options={['', ...clientStates.map(state => state)]}
              isRequired={false}
              register={register} 
              errors={errors}
            />
          }

          { clientZips && clientZips.length > 0 &&
            <FormInput 
              name="clientZip"
              labelKey="clientZip"
              labelText="Zip Code"
              type="select" 
              customClass="f-100"
              // @ts-ignore
              options={['', ...clientZips.map(zip => zip)]}
              isRequired={false}
              register={register} 
              errors={errors}
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
            isDisabled={!isDirty} 
            onClick={() => {}} 
            type='submit'            
          >
            Submit Search
          </Button>
          <Button 
            isDisabled={!isDirty} 
            type='button'
            onClick={() => reset()} 
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