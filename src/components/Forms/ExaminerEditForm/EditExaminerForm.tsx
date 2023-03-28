import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FORM_BUTTON_TEXT } from "@/constants";
import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";
import styles from './EditExaminerForm.module.scss'
import Spinner from "@/components/Spinner/Spinner";
import { httpPostInsertExaminer, httpPostSelectedExaminer, httpPostUpdateExaminer } from "@/services/http";

interface EditEditExaminerFormProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditExaminerForm:React.FC<EditEditExaminerFormProps> = ({
  tableData, 
  setTableData,
  selectedId,
  queryType
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [examinerId, setExaminerId] = useState<string>('')
  const [defaultSelectValues , setDefaultSelectValues] = useState({
    type: ''
  })

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
      
        const examinerInfo = await httpPostSelectedExaminer({ id: selectedId })
        
        const {
          id='', 
          name='', 
          code='', 
          type='',
          compensate='',
          isActive=false  
        } = examinerInfo

        setExaminerId(id)
        setDefaultSelectValues((prevState) => ({
          ...prevState,
          type: type
        }))
        
        setIsLoading(false)

        return {
          exName: name ,
          exCode: code ,
          exCompensate: compensate,
          exIsActive: isActive
        };
      }
    }
  });

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    
    if(queryType === 'insert') {
      const newRecord = await httpPostInsertExaminer({data})
      reset()
      setTableData([...tableData, newRecord])
    }

    if(queryType === 'update') {
      const updatedRecord = await httpPostUpdateExaminer({id: examinerId, data})
      reset(updatedRecord)
      const updatedData = tableData.map(record => {
        if(record.id === updatedRecord.id) {
          record = updatedRecord
        }
        return record
      })

      setTableData(updatedData)
    }
  };

  return (
    <div className='form-wrapper edit-form'>
      { isLoading ? <Spinner />
        : <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
            <FormInput 
              name="exName"
              labelKey="exName"
              labelText="Name"
              type="text"
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <section className={`flex-x ${styles['code-type-section']}`}>
                <FormInput 
                  name="exCode"
                  labelKey="exCode"
                  labelText="Code"
                  type="text"
                  customClass={styles.code}
                  isRequired={true}
                  register={register} 
                  errors={errors}
                />

                <Controller 
                  name={"type"}  
                  control={control} 
                  render={({
                    field: {onChange},
                  }) => {
                    return (
                      <FormInput 
                        name="type"
                        labelKey="type"
                        labelText="Type"
                        type="select" 
                        customClass={styles.type}
                        defaultValue={defaultSelectValues.type}
                        selectOnChange={onChange}
                        options={[{label:'1', value:'1'}, {label:'2', value:'2'}]}
                        isRequired={true}
                        register={register} 
                        errors={errors}
                      />
                    ) 
                  }}
                />
            </section>

            <section className={`flex-x ${styles['comp-active-section']}`}>
              <FormInput 
                name="exCompensate"
                labelKey="exCompensate"
                labelText="Compensation"
                type="number" 
                customClass={styles.comp}
                isRequired={false}
                register={register} 
                errors={errors}
                defaultValue={0}
                min='0'
              />

              
              <FormInput 
                name="exIsActive"
                labelKey="exIsActive"
                labelText="Is Active?"
                type="checkbox" 
                customClass={styles.active}
                defaultValue={false}
                isRequired={false}
                register={register} 
                errors={errors}
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

export default EditExaminerForm