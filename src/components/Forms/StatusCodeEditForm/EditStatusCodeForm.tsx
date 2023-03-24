import { TableRefs } from "@/types/common";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import 'react-tabs/style/react-tabs.css';

import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";

import { FORM_BUTTON_TEXT } from "@/constants";
import styles from './EditStatusCodeForm.module.scss'

interface EditStatusCodeFormProps {
  tableData: any[];
  setTableData: any;
  selectionType: TableRefs | '';
  selectedStatusCodeItemId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (propId: string) => void;
}

const EditStatusCodeForm:React.FC<EditStatusCodeFormProps> = ({
  tableData, 
  setTableData,
  selectionType,
  selectedStatusCodeItemId,
  queryType, 
  handleAfterSubmit = () => {},
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusCodeId, setStatusCodeId] = useState<string>('')

  const { 
    register, 
    handleSubmit, 
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
      defaultValues: async () => {
        if (selectedStatusCodeItemId) {

          setIsLoading(true)
          
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/post-selected-drop-down-options`, 
            {
              id: selectedStatusCodeItemId,
              selectionType
            }
          )
          
          const {
            id, 
            status_code=null, 
            status_desc=null, 
            type_code=null, 
            type_desc=null, 
            code: county_code=null, 
            county: county_name=null
          } = response.data[0]

          setStatusCodeId(id)
    
          setIsLoading(false)

          console.log( response.data[0])

          return {
            description: status_desc || type_desc || county_name  ,
            code: status_code || type_code || county_code ,
          };
        }
      }
    }
  );

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false

  const onSubmit = async(data:any) => {
    if(isDirtyAlt) return 
    
    if(queryType === 'insert') {
      // Adding selection typep so we know which table to update in the endpoint.
      const response = await axios.post(`
        ${process.env.NEXT_PUBLIC_BASE_URL}/api/management/post-insert-select-drop-down-options`, 
        {selectionType, ...data}
      )
      setTableData([...tableData, response.data.newRecord])
      reset()
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }

    if(queryType === 'update') {
      const response = await axios.post(`
        ${process.env.NEXT_PUBLIC_BASE_URL}/api/management/post-update-select-drop-down-options`, 
        {
          id: statusCodeId, 
          selectionType,
          ...data
        }
      ) 
      
      const updatedData = tableData.map(record => {
        if(record.id === response.data.updatedRecord.id) {
          record = response.data.updatedRecord
        }
        return record
      })

      setTableData(updatedData)

      reset(response.data.updatedRecord)
      // @ts-ignore
      toast[response.data.status](response.data.message)
    }
  }

  return (
    <div className='form-wrapper edit-form'>
      { isLoading ? <Spinner />
        :
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={`flex-y`}>
            <FormInput 
              name="description"
              labelKey="description"
              labelText="Name / Description"
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />

            <FormInput 
              name="code"
              labelKey="code"
              labelText="Code"
              customClass={styles.code}
              type="text" 
              isRequired={true}
              register={register} 
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            <Button type="submit" isDisabled={isDirtyAlt}>
              {FORM_BUTTON_TEXT[queryType]} 
            </Button>
          </section>
        </form>
      }
    </div>
  );
}


export default EditStatusCodeForm;