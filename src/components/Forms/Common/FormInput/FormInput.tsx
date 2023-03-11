import React from 'react';

// import styles from './FormInput.module.scss';

interface FormInput {
  customClass?: string;
  labelKey: string;
  labelText: string;
  isRequired: boolean;
  type:string;
  register: any;
  errors: any;
  options?: string[];
  min?: string;
  step?: string;
  max?: string;
  defaultValue?: any;
  name:string;
}

const Required:React.FC = () => (
  <span className='required'>*</span>
)

const FormInput:React.FC<FormInput> = ({ 
  name,
  customClass='', 
  labelKey, 
  labelText, 
  isRequired, 
  type='',
  register,
  errors,
  options,
  min='',
  step='',
  max='',
  defaultValue=''
}) => {

  return(
    <div className={`form-input-group ${customClass}`}>            
      <label htmlFor={labelKey}> 
        {labelText} {errors[labelKey] && isRequired ? <Required /> : ''}
      </label>  
      {
        type === 'select'? 
          (
            <select
              name={name} 
              defaultValue={defaultValue} {...register(labelKey, { required: isRequired })}
            >
              {options?.map( option => (
                <option 
                  key={option} 
                  value={option}
                > 
                  {option} 
                </option> 
              ))}
            </select>
          )
        : type === 'textarea' ? <textarea name={name} defaultValue={defaultValue} {...register(labelKey)}/>
        : <input 
            name={name}
            type={type} 
            min={min}
            step={step}
            max={max}
            defaultValue={defaultValue}
            {...register(labelKey, { required: isRequired })} 
          />
      }
    </div>
  )
}

export default FormInput;