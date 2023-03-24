import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast'
import axios from "axios";

import { FORM_BUTTON_TEXT } from "@/constants";
import { abbreviatedStatesLabelValuePair } from "@/utils/UnitedStates";
import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";
import styles from './EditCompanyForm.module.scss'
import Spinner from "@/components/Spinner/Spinner";

interface EditEditCompanyFormProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditCompanyForm:React.FC<EditEditCompanyFormProps> = ({
  tableData, 
  setTableData,
  selectedId,
  queryType
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [defaultSelectValues , setDefaultSelectValues] = useState({
    status: '',
    state: ''
  })
  const [companyId, setCompanyId] = useState<string>('')

  const { 
    register, 
    handleSubmit, 
    reset,
    control,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: async () => {
      if (selectedId) {

        setIsLoading(true)
        
        const response = await axios.post('/api/companies/post-selected-company', { id: selectedId })
        
        const {
          id='', tticoname='', tcity='', tadd1='',
          tzip='', tpercent='', tproduct1='',tproduct2='' ,tproduct3='',
          tproduct4='', tstat='', abbr='', tstate=''  
        } = response.data[0]

        setCompanyId(id)
  
        setIsLoading(false)

        setDefaultSelectValues((prevState) => ({
          ...prevState,
          status: tstat ,
          state: tstate ,
        }))

        return {
          companyName: tticoname ,
          companyAbbr: abbr ,
          address: tadd1 ,
          city: tcity ,
          zipCode: tzip ,
          percent: tpercent ,
          product1: tproduct1 ,
          product2: tproduct2 ,
          product3: tproduct3 ,
          product4: tproduct4  
        };
      }
    }
  });

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    
    if(queryType === 'insert') {
      const response = await axios.post(`/api/companies/post-insert-company`, data)
      reset()
      setTableData([...tableData, response.data.newRecord])
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/companies/post-update-company`, {id: companyId, ...data}) // Passing id to update correct record
      reset(response.data.updatedRecord)
      const updatedData = tableData.map(record => {
        if(record.id === response.data.updatedRecord.id) {
          record = response.data.updatedRecord
        }
        return record
      })

      setTableData(updatedData)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }
  };

  return (
    <div className='form-wrapper edit-form'>
      { isLoading ? <Spinner />
        : <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
            <section className={`flex-x ${styles['company-abbr-status-section']}`}>
              <FormInput 
                name="companyName"
                customClass={styles.company}
                labelKey="companyName"
                labelText="Company Name"
                type="text"
                isRequired={true}
                register={register} 
                errors={errors}
              />

              <FormInput 
                name="companyAbbr"
                customClass={styles.client}
                labelKey="companyAbbr"
                labelText="Abbr."
                type="text"
                isRequired={true}
                register={register} 
                errors={errors}
              />

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
                      defaultValue={defaultSelectValues.status}
                      customClass={styles.status}
                      selectOnChange={onChange}
                      options={[{label:'C', value:'C'}, {label:'O', value:'O'}]}
                      isRequired={true}
                      register={register} 
                      errors={errors}
                    />
                  ) 
                }}
              />
            </section>

            <FormInput 
              name="address"
              labelKey="address"
              labelText="Address"
              type="text" 
              isRequired={true}
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
                        defaultValue={defaultSelectValues.state}
                        customClass={styles.state}
                        selectOnChange={onChange}
                        options={abbreviatedStatesLabelValuePair}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />

              <FormInput 
                name="zipCode"
                labelKey="zipCode"
                labelText="Zip Code"
                customClass={styles.zip}
                type="text" 
                isRequired={true}
                register={register} 
                errors={errors}
              />
            </section>

            <section className={`flex-x ${styles['percent-prod-section']}`}>
              <FormInput 
                name="percent"
                labelKey="percent"
                labelText="Percent"
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
              />
              
              <FormInput 
                name="product1"
                labelKey="product1"
                labelText="Product 1"
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
              />
              
              <FormInput 
                name="product2"
                labelKey="product2"
                labelText="Product 2"
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
              />

              <FormInput 
                name="product3"
                labelKey="product3"
                labelText="Product 3"
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
              />


              <FormInput 
                name="product4"
                labelKey="product4"
                labelText="Product 4"
                type="number" 
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
              />
            </section>

            <section className="submit-button-section">
              <Button type="submit" isDisabled={!isDirty}>
                {FORM_BUTTON_TEXT[queryType]} 
              </Button>
            </section>
          </form>
      }
    </div>
  );
}

export default EditCompanyForm