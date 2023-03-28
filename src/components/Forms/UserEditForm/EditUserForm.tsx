import { useState } from "react";
import {  useForm } from "react-hook-form";
import toast from 'react-hot-toast'

import { FORM_BUTTON_TEXT } from "@/constants";
import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";
import { httpPostInsertUser, httpPostSelectedUser, httpPostUpdateUser } from "@/services/http";

interface EditEditUserFormProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditUserForm:React.FC<EditEditUserFormProps> = ({
  tableData, 
  setTableData,
  selectedId,
  queryType
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('')

  const { 
    register, 
    handleSubmit, 
    reset,
    watch,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: async () => {
      if (selectedId) {

        setIsLoading(true)
        
        const userInfo = await httpPostSelectedUser({ id: selectedId })
        
        const {
          id='', 
          username='', 
          l_name='', 
          f_name=''
        } = userInfo

        setUserId(id)
        setIsLoading(false)

        return {
          username,
          l_name ,
          f_name
        };
      }
    }
  });

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    
    if(queryType === 'insert') {
      const newRecord = await httpPostInsertUser({data})
      reset()
      setTableData([...tableData, newRecord])
    }

    if(queryType === 'update') {
      const updatedRecord = await httpPostUpdateUser({id: userId, data})

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
              name="username"
              labelKey="username"
              labelText="UserName"
              type="text"
              isRequired={true}
              register={register} 
              errors={errors}
              autoComplete='off'
            />

            <section className='flex-x gap-sm'>
                <FormInput 
                  name="f_name"
                  labelKey="f_name"
                  labelText="First Name"
                  type="text"
                  isRequired={true}
                  register={register} 
                  errors={errors}
                  autoComplete='off'
                />

                <FormInput 
                  name="l_name"
                  labelKey="l_name"
                  labelText="Last Name"
                  type="text"
                  isRequired={true}
                  register={register} 
                  errors={errors}
                  autoComplete='off'
                />
            </section>

              <FormInput 
                name="password"
                labelKey="password"
                labelText="New Password"
                type="password" 
                isRequired={true}
                register={register} 
                errors={errors}
                defaultValue={null}
                autoComplete='new-password'
              />

              
              <FormInput 
                name="confirmPassword"
                labelKey="confirmPassword"
                labelText="Confirm New Password"
                type="password" 
                defaultValue=''
                isRequired={true}
                register={register} 
                errors={errors}
                autoComplete='new-password'
                validate={(val: string) => {
                  if (watch('password') != val) {
                    return toast.error('Your passwords do no match', {id: 'passwords-do-not-match'})
                  }
                }}
              />
              
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

export default EditUserForm