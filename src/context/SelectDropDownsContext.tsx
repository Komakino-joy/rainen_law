"use client";

import { httpGetSelectDropDownOptions } from "@/services/http";
import {
  City,
  ClientStatus,
  LabelValuePair,
  PropertyStatus,
  PropertyType,
} from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface OwnProps {
  isLoadingSelectDropDownsContext: boolean;
  clientStatusList: ClientStatus[];
  propertyStatusList: PropertyStatus[];
  propertyTypeList: PropertyType[];
  cityList: City[];
  clientStatusDropDownOptions: LabelValuePair[];
  propertyStatusDropDownOptions: LabelValuePair[];
  propertyTypeDropDownOptions: LabelValuePair[];
  cityDropDownOptions: LabelValuePair[];
  countyDropDownOptions: LabelValuePair[];
}

const SelectDropDownsContext = createContext<OwnProps>({
  isLoadingSelectDropDownsContext: false,
  clientStatusList: [],
  propertyStatusList: [],
  propertyTypeList: [],
  cityList: [],
  clientStatusDropDownOptions: [],
  propertyStatusDropDownOptions: [],
  propertyTypeDropDownOptions: [],
  cityDropDownOptions: [],
  countyDropDownOptions: [],
});

export const SelectDropDownsContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const [isLoadingSelectDropDownsContext, setIsLoading] =
    useState<boolean>(false);
  const [clientStatusList, setClientStatusList] = useState([]);
  const [propertyStatusList, setPropertyStatusList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [clientStatusDropDownOptions, setClientStatusDropDownOptions] =
    useState([]);
  const [propertyStatusDropDownOptions, setPropertyStatusDropDownOptions] =
    useState([]);
  const [propertyTypeDropDownOptions, setPropertyTypeDropDownOptions] =
    useState([]);
  const [cityDropDownOptions, setCityDropDownOptions] = useState([]);
  const [countyDropDownOptions, setCountyDropDownOptions] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      mounted.current = true;
      const httpFetchDropDownOptions = async () => {
        setIsLoading(true);
        const selectDropDownOptions = await httpGetSelectDropDownOptions();
        const {
          clientStatusList,
          propertyStatusList,
          propertyTypeList,
          cityList,
          countyList,
        } = selectDropDownOptions;

        setClientStatusList(clientStatusList);
        setPropertyStatusList(propertyStatusList);
        setPropertyTypeList(propertyTypeList);
        setCityList(cityList);

        setClientStatusDropDownOptions(
          clientStatusList.map((row: ClientStatus) => ({
            label: row.status_desc,
            value: row.status_desc,
          }))
        );
        setPropertyStatusDropDownOptions(
          propertyStatusList.map((row: PropertyStatus) => ({
            label: row.status_desc,
            value: row.status_desc,
          }))
        );
        setPropertyTypeDropDownOptions(
          propertyTypeList.map((row: PropertyType) => ({
            label: row.type_code,
            value: row.type_code,
          }))
        );
        setCityDropDownOptions(
          cityList.map((row: Partial<City>) => ({
            label: row.city,
            value: row.city,
          }))
        );
        setCountyDropDownOptions(
          countyList.map((row: Partial<City>) => ({
            label: row.county,
            value: row.county,
          }))
        );

        setIsLoading(false);
      };

      if (mounted) {
        httpFetchDropDownOptions();
      }

      return () => {
        mounted.current = false;
      };
    }
  }, []);

  return (
    <SelectDropDownsContext.Provider
      value={{
        isLoadingSelectDropDownsContext,
        clientStatusList,
        propertyStatusList,
        propertyTypeList,
        cityList,
        clientStatusDropDownOptions,
        propertyStatusDropDownOptions,
        propertyTypeDropDownOptions,
        cityDropDownOptions,
        countyDropDownOptions,
      }}
    >
      {children}
    </SelectDropDownsContext.Provider>
  );
};

export const useSelectDropDownsContext = () =>
  useContext(SelectDropDownsContext);
