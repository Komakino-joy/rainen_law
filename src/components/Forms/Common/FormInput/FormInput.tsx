import Select from '@/components/Select/Select';
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
  options?: any[];
  min?: string;
  step?: string;
  max?: string;
  defaultValue?: any;
  name:string;
  disabled?:boolean;
  selectOnChange?: any;
  validate?: any;
  autoComplete?: 'off' | 'new-password' | 'on' | null;
  checked?:boolean;
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
  defaultValue='',
  disabled=false,
  selectOnChange,
  validate=null,
  autoComplete,
  checked
}) => {

  return(
    <div className={`form-input-group ${customClass}`}>            
      <label htmlFor={labelKey}> 
        {labelText} {errors[labelKey] && isRequired ? <Required /> : ''}
      </label>  
      {
        type === 'select'  && options ? 
          <Select 
            onChange={selectOnChange} 
            options={options}  
            defaultValue={defaultValue}
          /> 
          
        : type === 'textarea' 
        ? <textarea 
            name={name} 
            defaultValue={defaultValue} 
            {...register(labelKey, { 
              required: isRequired, 
              validate: validate
            })} 
          />
        : <input 
            name={name}
            type={type}
            checked={checked} 
            min={min}
            step={step || 'any'}
            max={max}
            defaultValue={defaultValue}
            disabled={disabled}
            autoComplete={autoComplete}
            {...register(labelKey, { 
              required: isRequired, 
              validate: validate
            })} 
          />
      }
    </div>
  )
}

export default FormInput;