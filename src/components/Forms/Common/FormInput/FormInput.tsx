import "react-datepicker/dist/react-datepicker.css";
import "../../../../../src/styles/home.module.scss";
import { CalendarIcon, InfoIcon } from "@/components/Icons/Icons";
import Select from "@/components/Select/Select";
import Tooltip from "@/components/Tooltip/Tooltip";
import React from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  ControllerRenderProps,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import style from "./FormInput.module.scss";

interface FormInput {
  customClass?: string;
  labelKey: string;
  labelText: string;
  isRequired: boolean;
  type: string;
  options?: any[];
  min?: string;
  step?: string;
  max?: string;
  defaultValue?: any;
  name: string;
  disabled?: boolean;
  selectOnChange?: any;
  validate?: any;
  autoComplete?: string;
  checked?: boolean;
  tooltipText?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  onBlur?: () => void;
  field?: ControllerRenderProps<FieldValues, string>;
}

const Required: React.FC = () => <span className="required">*</span>;

const FormInput: React.FC<FormInput> = (
  {
    customClass = "",
    labelKey,
    labelText,
    isRequired,
    type = "",
    register,
    errors,
    options,
    min = "",
    step = "",
    max = "",
    defaultValue = "",
    disabled = false,
    selectOnChange,
    validate = null,
    autoComplete = "off",
    checked,
    tooltipText = "",
    onBlur,
    field,
  },
  props
) => {
  const isError = Boolean(errors[labelKey] && isRequired);

  return (
    <div className={`form-input-group ${customClass}`}>
      <label htmlFor={labelKey}>
        {labelText} {isRequired ? <Required /> : ""}{" "}
        {tooltipText.length > 0 && (
          <Tooltip text={tooltipText} icon={<InfoIcon />} />
        )}
      </label>
      {type === "date" && field ? (
        <div className={style.date_field}>
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            showIcon
            icon={<CalendarIcon />}
            //@ts-ignore
            toggleCalendarOnIconClick
          />
        </div>
      ) : type === "select" && options ? (
        <Select
          onChange={selectOnChange}
          options={options}
          defaultValue={defaultValue}
          isError={isError}
        />
      ) : type === "textarea" ? (
        <textarea
          defaultValue={defaultValue}
          {...register(labelKey, {
            required: isRequired,
            validate: validate,
          })}
          {...props}
        />
      ) : (
        <input
          className={`${isError && "border-red"}`}
          checked={checked}
          min={min}
          step={step || "any"}
          max={max}
          defaultValue={defaultValue}
          disabled={disabled}
          autoComplete={autoComplete}
          {...register(labelKey, {
            required: isRequired,
            validate: validate,
          })}
          onBlur={onBlur}
        />
      )}
    </div>
  );
};

export default FormInput;
