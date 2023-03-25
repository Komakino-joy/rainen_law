import {  useForm } from "react-hook-form";
import Button from "@/components/Button/Button";
import FormInput from "../Common/FormInput/FormInput";
import { useAuth } from "@/context/AuthContext";

const EditUserForm = () => {

  const { login } = useAuth()

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty } 
  } = useForm();

  const onSubmit = async(data:any) => {
    if(!isDirty) return 
    login(data)
  };

  return (
    <div className='form-wrapper edit-form'>
      <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
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

        <FormInput 
          name="password"
          labelKey="password"
          labelText="Password"
          type="password" 
          isRequired={true}
          register={register} 
          errors={errors}
          autoComplete='off'
        />
          
        <section className="submit-button-section">
          <Button type="submit"  isDisabled={false}>
            Sign In 
          </Button>
        </section>
      </form>
    </div>
  );
}

export default EditUserForm