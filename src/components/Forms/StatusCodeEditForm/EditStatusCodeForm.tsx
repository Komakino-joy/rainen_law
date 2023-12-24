import { TableRefs } from "@/types/common";

import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-tabs/style/react-tabs.css";

import Button from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";
import FormInput from "../Common/FormInput/FormInput";

import { FORM_BUTTON_TEXT } from "@/constants";
import {
  httpPostInsertDropDownOptions,
  httpPostSelectedDropDownOptions,
  httpPostUpdateSelectDropDownOptions,
} from "@/services/http";
import toast from "react-hot-toast";

interface EditStatusCodeFormProps {
  tableData: any[];
  setTableData: any;
  selectionType: TableRefs | "";
  selectedStatusCodeItemId: string | null;
  queryType: "update" | "insert";
}

const EditStatusCodeForm: React.FC<EditStatusCodeFormProps> = ({
  tableData,
  setTableData,
  selectionType,
  selectedStatusCodeItemId,
  queryType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCodeId, setStatusCodeId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
    defaultValues: async () => {
      if (selectedStatusCodeItemId) {
        setIsLoading(true);

        const statusCodeInfo = await httpPostSelectedDropDownOptions({
          id: selectedStatusCodeItemId,
          selectionType,
        });

        const {
          id,
          status_code = null,
          status_desc = null,
          type_code = null,
          type_desc = null,
          code: county_code = null,
          county: county_name = null,
        } = statusCodeInfo;

        setStatusCodeId(id);

        setIsLoading(false);

        return {
          description: status_desc || type_desc || county_name,
          code: status_code || type_code || county_code,
        };
      }
    },
  });

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false;

  const onSubmit = async (data: any) => {
    if (isDirtyAlt) return;

    if (queryType === "insert") {
      // Adding selection type so we know which table to update in the endpoint.
      const newRecord = await httpPostInsertDropDownOptions({
        selectionType,
        data,
      });
      setTableData([...tableData, newRecord]);
      reset();
    }

    if (queryType === "update") {
      const updatedRecord = await httpPostUpdateSelectDropDownOptions({
        id: statusCodeId,
        selectionType,
        data,
      });

      const updatedData = tableData.map((record) => {
        if (record.id === updatedRecord.id) {
          record = updatedRecord;
        }
        return record;
      });

      setTableData(updatedData);

      reset(updatedRecord);
    }
  };

  const onSubmitError = (data: any) => {
    if (errors)
      toast.error("All required fields must be filled out.", {
        id: "status-code-form-error",
      });
  };

  return (
    <div className="form-wrapper edit-form">
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
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
      )}
    </div>
  );
};

export default EditStatusCodeForm;
