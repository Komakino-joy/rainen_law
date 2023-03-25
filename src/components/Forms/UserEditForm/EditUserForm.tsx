import { useState } from "react";
import {  useForm } from "react-hook-form";
import toast from 'react-hot-toast'
import axios from "axios";

import { FORM_BUTTON_TEXT } from "@/constants";
import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";

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
        
        const response = await axios.post('/api/users/post-selected-user', { id: selectedId })
        
        const {
          id='', 
          username='', 
          l_name='', 
          f_name=''
        } = response.data[0]

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
      const response = await axios.post(`/api/users/post-insert-user`, data)
      reset()
      setTableData([...tableData, response.data.newRecord])
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`/api/users/post-update-user`, {id: userId, ...data}) // Passing id to update correct record
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