"use client";

import { httpGetCities } from "@/services/http";
import { County } from "@/types/common";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface CitiesProps {
  isLoadingCities: boolean;
  countyIdMap: any;
  countiesList: any[];
}

const Cities = createContext<CitiesProps>({
  isLoadingCities: false,
  countyIdMap: {},
  countiesList: [],
});

export const CitiesProvider = ({ children }: { children: any }) => {
  const [isLoadingCities, setIsLoading] = useState<boolean>(false);
  const [countiesList, setCountiesList] = useState([]);
  const [countyIdMap, setCountyIdMap] = useState({});

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      mounted.current = true;
      const httpFetchCountyInfo = async () => {
        setIsLoading(true);
        const counties = await httpGetCities();

        setCountiesList(
          counties.map((county: County) => ({
            label: county.county,
            value: county.code,
          }))
        );

        setCountyIdMap(
          counties.reduce((acc: {}, county: any) => {
            // @ts-ignore
            acc[county.code] = county.county;
            return acc;
          }, {})
        );

        setIsLoading(false);
      };

      if (mounted) {
        httpFetchCountyInfo();
      }

      return () => {
        mounted.current = false;
      };
    }
  }, []);

  return (
    <Cities.Provider
      value={{
        countiesList,
        countyIdMap,
        isLoadingCities,
      }}
    >
      {children}
    </Cities.Provider>
  );
};

export const useCities = () => useContext(Cities);
