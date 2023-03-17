import React from 'react';

import Select, { createFilter } from 'react-select';
import CustomOption from './CustomOption'
import CustomMenuList from './CustomMenuList'

import styles from './Select.module.scss'

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '30px',
      height: '30px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px',
      padding: '0 6px'
    }),
    
    input: (provided: any, state: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (state: any) => ({
      display: 'none',
      border: '1px solid red'

    }),
    indicatorsContainer: (provided: any, state: any) => ({
      display: "flex",
      alignItems: "center",
    }),
    
    clearIndicator: (provided: any, state: any) => ({
      ...provided,
      padding: '0 0 0 8px',
      cursor: 'pointer',
      "&:hover": {
        color: "red"
      }
    }),
    
    dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        padding: '0',
        cursor: 'pointer',
        "&:hover": {
          color: "blue"
        }
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      height: '35px',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      padding: '10px 20px 10px 5px',
    }),
  };

export default ({
  onChange,
  options,
  defaultValue
}:{
  onChange: () => void;
  options: any[];
  defaultValue: any;
}) => (
  <>
    <Select
      defaultInputValue={defaultValue}

      className={styles['select-container']}
      classNamePrefix="select"
      
    
      styles={customStyles}
      isClearable={true}
      isSearchable={true}
      
      defaultValue={{label: '', value:''}}
      options={[{label: '', value:''}, ...options]}

      filterOption={createFilter({ ignoreAccents: false })}
      components={{ Option: CustomOption, MenuList: CustomMenuList }}
      // @ts-ignore
      onChange={(input) => {
        // @ts-ignore
        if(input?.value) {
          // @ts-ignore
          onChange(input.value)
        } 
        return
      }}
    />
  </>
)
