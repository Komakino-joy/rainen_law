import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useCompaniesContext } from "@/context/Companies";
import { timestampToDate } from "@/utils";
import { abbreviatedStatesLabelValuePair } from "@/utils/UnitedStates";
import FormInput from "../Common/FormInput/FormInput";
import styles from './EditINSForm.module.scss'
import Button from "@/components/Button/Button";
import { FORM_BUTTON_TEXT } from "@/constants";
import Spinner from "@/components/Spinner/Spinner";
import { useClientsContext } from "@/context/Clients";

interface EditINSFormProps {
  insTitleId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (propId: string) => void;
}

const EditINSForm:React.FC<EditINSFormProps> = ({
  insTitleId,
  queryType,
  handleAfterSubmit = () => {},
}) => {

  const {companiesList} = useCompaniesContext()
  const {clientSelectOptions} = useClientsContext()
  const { CNAME: clientNames } = clientSelectOptions

  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const [defaultSelectValues , setDefaultSelectValues] = useState({
    state: '',
    company: '',
    status: '',
    assigned: '',
    printed: '',
    clientName: ''
  })

  const [insTitleInfoSnippet, setInsTitleInfoSnippet] = useState<{
    id:string | null;
    inmbr: string | null;
    city: string | null;
    fileNumber: string | null;
    lastUpdated: {
      date:string, 
      time:string
    } | null;
  }>({
    id: null, 
    inmbr: null,
    city: null,
    fileNumber: null,
    lastUpdated: null
  })

  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, dirtyFields } 
  } = useForm({
    defaultValues: async () => {
      if (insTitleId) {

        setIsLoading(true)
        
        const response = await axios.post('/api/titles/post-selected-ins-title', {insTitleId})
        
        const {
          id='', tticoname='', LAST_UPDATED='', INMBR='', IFILE='', ICITY='', ISTATE='', IZIP='',
          ISTRET='', ILOT='', ICONDO='', IUNIT='', PREMDUE='', PREMPAID='', AGENTFEE='',
          ICDATE='', IPDATE='', IBILL='', IPOLDATE='', TITLECO='', ISTAT='', IREMIT='',
          P='', CNAME='', CFILE='', OPOLICYNUM='', OPOLICYAMT='', LPOLICYNUM='', LPOLICYAMT='', INOTES='',
          TICOFEE
        } = response.data[0]

        setInsTitleInfoSnippet((prevState) => ({
          ...prevState,
          id: id,
          inmbr: INMBR,
          fileNumber: IFILE,
          city: ICITY,
          lastUpdated: LAST_UPDATED ? timestampToDate(LAST_UPDATED, 'mmDDyyyy') : null
        }))
  
        setIsLoading(false)

        setDefaultSelectValues({
          state: ISTATE,
          company: tticoname,
          status: ISTAT,
          assigned: IREMIT,
          printed: P,
          clientName: CNAME
        })

        return {
          fileNumber: IFILE,
          city: ICITY,
          state: ISTATE,
          zip: IZIP,
          street: ISTRET,
          lot: ILOT,
          condo: ICONDO,
          unit: IUNIT,
          premiumDue: PREMDUE,
          premiumPaid: PREMPAID,
          agentFee: AGENTFEE,
          billNumber: IBILL,
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
          notes: INOTES,
          datePaid: IPDATE ? timestampToDate(IPDATE, 'yyyyMMdd').date : null,
          dateBilled: ICDATE ? timestampToDate(ICDATE, 'yyyyMMdd').date : null,
          policyDate: IPOLDATE ?timestampToDate(IPOLDATE, 'yyyyMMdd').date : null,
          ticoFee: TICOFEE
        };
      }
    }
  });

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const onSubmit = async(data:any) => {
    if(isDirtyAlt) return 
    
    if(queryType === 'insert') {
      const response = await axios.post(`/api/titles/post-add-ins-title`, data)
      reset()
      handleAfterSubmit(response.data.newInsTitleId)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/titles/post-update-ins-title`, {id: insTitleInfoSnippet.id, ...data}) // Passing id to update correct record
      if (insTitleInfoSnippet.id) {
        handleAfterSubmit(insTitleInfoSnippet.id)
        reset(response.data.updatedRecord)
        // @ts-ignore
        toast[response.data.status](response.data.message)
      }
    }
  };

  if(isLoading) {
    return <div className='form-wrapper edit-form'><Spinner /></div>
  }

  return (
    <div className='form-wrapper edit-form'>
        <header>
          { insTitleInfoSnippet.fileNumber && insTitleInfoSnippet.city ?
            <>
              <span>{insTitleInfoSnippet.fileNumber} / {insTitleInfoSnippet.city}</span>
              <span>Title ID: {insTitleInfoSnippet.id}</span>
            </>
            : null
          }
        </header>
      <form onSubmit={handleSubmit(onSubmit)}>

        <section className={`flex-x ${styles['top-section']}`}>
          <div className={`flex-y ${styles['column-1']}`}>
            <FormInput 
              name="fileNumber"
              labelKey="fileNumber"
              labelText="File #"
              customClass={styles.fileNumber}
              type="number" 
              defaultValue={0}
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="street"
              labelKey="street"
              labelText="Street"
              customClass={styles.street}
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />
            <FormInput 
              name="city"
              labelKey="city"
              labelText="City"
              type="text" 
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <div className={`flex-x gap-sm ${styles["state-zip-section"]}`}>
              <Controller 
                name={"state"}  
                control={control} 
                render={({
                  field: {onChange},
                }) => {
                  return (
                    <FormInput 
                      name="state"
                      labelKey="state"
                      labelText="State"
                      type="select" 
                      customClass={styles.state}
                      selectOnChange={onChange}
                      defaultValue={defaultSelectValues.state}
                      options={abbreviatedStatesLabelValuePair}
                      isRequired={false}
                      register={register} 
                      errors={errors}
                    />
                  ) 
                }}
              />

              <FormInput 
                name="zip"
                labelKey="zip"
                labelText="Zip Code"
                customClass={styles.zip}
                type="text" 
                isRequired={false}
                register={register} 
                errors={errors}
              />
              
            </div>



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

          <div className={`flex-y ${styles['column-2']}`}>
            <FormInput 
              name="premiumDue"
              labelKey="premiumDue"
              labelText="Premium Due"
              type="number" 
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="premiumPaid"
              labelKey="premiumPaid"
              labelText="Premium Paid"
              type="number" 
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="agentFee"
              labelKey="agentFee"
              labelText="Agent Fee"
              type="number" 
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
              isRequired={false}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="ticoFee"
              labelKey="ticoFee"
              labelText="Tico Fee"
              type="number" 
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
              isRequired={false}
              register={register} 
              errors={errors}
            />
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
              defaultValue={0}
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
        <div className={styles["section-divider"]}/>
          <div className={`flex-x ${styles['status-type-assigned-section']}`}>
            { companiesList && companiesList.length > 0 &&
              <Controller 
                name={"titleCompany"}  
                control={control} 
                render={({
                  field: {onChange},
                }) => {
                  return (
                    <FormInput 
                      name="titleCompany"
                      labelKey="titleCompany"
                      labelText="Title Company"
                      type="select" 
                      defaultValue={defaultSelectValues.company}
                      customClass={styles["title-company-select"]}
                      selectOnChange={onChange}
                      options={companiesList}
                      isRequired={false}
                      register={register} 
                      errors={errors}
                    />
                  ) 
                }}
              />
            }

            <Controller 
              name={"status"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="status"
                    labelKey="status"
                    labelText="Status"
                    type="select" 
                    selectOnChange={onChange}
                    defaultValue={defaultSelectValues.status}
                    options={[{label:'C', value:'C'}, {label:'O', value:'O'}]}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
            
            <Controller 
              name={"assigned"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="assigned"
                    labelKey="assigned"
                    labelText="Assigned"
                    type="select" 
                    selectOnChange={onChange}
                    defaultValue={defaultSelectValues.assigned}
                    options={[{label:'N', value:'N'}, {label:'Y', value:'Y'}]}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          
            <Controller 
              name={"printed"}  
              control={control} 
              render={({
                field: {onChange},
              }) => {
                return (
                  <FormInput 
                    name="printed"
                    labelKey="printed"
                    labelText="Printed"
                    type="select" 
                    selectOnChange={onChange}
                    defaultValue={defaultSelectValues.printed}
                    options={[{label:'N', value:'N'}, {label:'Y', value:'Y'}]}
                    isRequired={false}
                    register={register} 
                    errors={errors}
                  />
                ) 
              }}
            />
          </div>

          <div className={`flex-x ${styles['comp-ref-file-num-section']}`}>
          { clientNames && clientNames.length > 0 &&
                <Controller 
                  name={"clientName"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="clientName"
                        labelKey="clientName"
                        labelText="Name"
                        type="select" 
                        defaultValue={defaultSelectValues.clientName}
                        customClass={styles.clientName}
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

            <FormInput 
              name="clientFileNumber"
              labelKey="clientFileNumber"
              labelText="Client's File #"
              customClass={styles.clientFileNumber}
              type="text" 
              isRequired={false}
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
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
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
              defaultValue={0}
              min="0.00" 
              step="0.01" 
              max="2500000000"
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


        <section className="submit-button-section">
            <Button 
              type="submit" 
              isDisabled={isDirtyAlt}
            >
              {FORM_BUTTON_TEXT[queryType]} 
            </Button>
          </section>

          <footer className="form-footer">
            { insTitleInfoSnippet.lastUpdated && 
              <>
                <span>Last Updated: { insTitleInfoSnippet.lastUpdated.date }</span>
                <span className="italicized-text">{ insTitleInfoSnippet.lastUpdated.time }</span>
              </>
            }
          </footer>
      </form>
    </div>
  );
}

export default EditINSForm