import { Client, Examiner, INSTitle, Property } from "../types/common";
import axios from "axios";
import toast from "react-hot-toast";

// ---------------- Property http requests
export const httpGetLatestUpdatedProperties = async () => {
  const response = await axios.get(
    `/api/properties/get-latest-updated-properties`
  );
  return response.data;
};

export const httpGetDistinctPropertyTypeOptions = async () => {
  const response = await axios.get(`/api/properties/get-distinct-type-options`);
  return response.data;
};

export const httpGetDistinctPropertyStatusOptions = async () => {
  const response = await axios.get(
    `/api/properties/get-distinct-status-options`
  );
  return response.data;
};

export const httpGetDistinctPropertyAssignOptions = async () => {
  const response = await axios.get(
    `/api/properties/get-distinct-assign-options`
  );
  return response.data;
};

export const httpGetPropertyCompRef = async () => {
  const response = await axios.get(`/api/properties/get-new-comp-ref`);
  return response.data.newCompRef;
};

export const httpPostSelectedProperty = async ({ id }: { id: string }) => {
  const response = await axios.post("/api/properties/post-selected-property", {
    propertyId: id,
  });
  return response.data[0];
};

export const httpPostInsertProperty = async ({
  username,
  data,
}: {
  username: string;
  data: Property;
}) => {
  const response = await axios.post(`/api/properties/post-insert-property`, {
    ...data,
    created_by: username,
    last_updated_by: username,
  });
  return response.data;
};

export const httpPostUpdateProperty = async ({
  id,
  username,
  data,
}: {
  id: string;
  username: string;
  data: Property;
}) => {
  const response = await axios.post(`/api/properties/post-update-property`, {
    ...data,
    id,
    last_updated_by: username,
  });
  return response.data;
};

export const httpPostDeleteProperty = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/properties/post-delete-property`, {
    id,
  });
  return response;
};

// ---------------- Client http requests
export const httpGetAllClients = async () => {
  const response = await axios.get(`/api/clients/get-all-clients`);
  return response.data;
};

export const httpGetLatestUpdatedClients = async () => {
  const response = await axios.get(`/api/clients/get-latest-updated-clients`);
  return response.data;
};

export const httpPostSelectedClient = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/clients/post-selected-client`, {
    clientId: id,
  });
  return response.data[0];
};

export const httpPostInsertClient = async ({
  username,
  data,
}: {
  username: string;
  data: Client;
}) => {
  const response = await axios.post(`/api/clients/post-insert-client`, {
    ...data,
    created_by: username,
    last_updated_by: username,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.newClientId;
};

export const httpPostUpdateClient = async ({
  id,
  username,
  data,
}: {
  id: string;
  username: string;
  data: Client;
}) => {
  const response = await axios.post(`/api/clients/post-update-client`, {
    ...data,
    id, // Passing id to update correct record
    last_updated_by: username,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.updatedRecord;
};

export const httpPostDeleteClient = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/clients/post-delete-client`, { id });
  return response;
};

// ---------------- Examiner http requests
export const httpGetExaminers = async () => {
  const response = await axios.get(`/api/examiners/get-examiners`);
  return response.data;
};

export const httpPostSelectedExaminer = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/examiners/post-selected-examiner`, {
    id,
  });
  return response.data[0];
};

export const httpPostInsertExaminer = async ({ data }: { data: Examiner }) => {
  const response = await axios.post(
    `/api/examiners/post-insert-examiner`,
    data
  );
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.newRecord;
};

export const httpPostUpdateExaminer = async ({
  id,
  data,
}: {
  id: string;
  data: Examiner;
}) => {
  const response = await axios.post(`/api/examiners/post-update-examiner`, {
    ...data,
    id,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.updatedRecord;
};

// ---------------- County http requests
export const httpGetCounties = async () => {
  const response = await axios.get(`/api/counties/get-counties`);
  return response.data;
};

// ---------------- InsTitle http requests
export const httpGetAllInsTitles = async () => {
  const response = await axios.get(`/api/titles/get-all-ins-titles`);
  return response.data;
};

export const httpPostSelectedInsTitle = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/titles/post-selected-ins-title`, {
    insTitleId: id,
  });
  return response.data[0];
};

export const httpPostInsertInsTitle = async ({
  username,
  data,
}: {
  username: string;
  data: INSTitle;
}) => {
  const response = await axios.post(`/api/titles/post-insert-ins-title`, {
    ...data,
    created_by: username,
    last_updated_by: username,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.newInsTitleId;
};

export const httpPostUpdateInsTitle = async ({
  id,
  username,
  data,
}: {
  id: string;
  username: string;
  data: INSTitle;
}) => {
  const response = await axios.post(`/api/titles/post-update-ins-title`, {
    ...data,
    id, // Passing id to update correct record
    last_updated_by: username,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.updatedRecord;
};

export const httpGetDistinctCityOptions = async () => {
  const response = await axios.get(`/api/properties/get-distinct-city-options`);
  return response.data;
};

export const httpGetSelectDropDownOptions = async () => {
  const response = await axios.get(
    `/api/management/get-select-drop-down-options`
  );
  return response.data;
};

export const httpGetUsers = async () => {
  const response = await axios.get(`/api/users/get-users`);
  return response.data;
};

export const httpGetLatestUpdatedInsTitles = async () => {
  const response = await axios.get(`/api/titles/get-latest-updated-ins-titles`);
  return response.data;
};

export const httpPostSelectedDropDownOptions = async ({
  id,
  selectionType,
}: {
  id: string;
  selectionType: string;
}) => {
  const response = await axios.post(
    `/api/management/post-selected-drop-down-options`,
    {
      id,
      selectionType,
    }
  );
  return response.data[0];
};

export const httpPostInsertDropDownOptions = async ({
  data,
  selectionType,
}: {
  data: {};
  selectionType: string;
}) => {
  const response = await axios.post(
    `/api/management/post-insert-select-drop-down-options`,
    {
      ...data,
      selectionType,
    }
  );
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.newRecord;
};

export const httpPostUpdateSelectDropDownOptions = async ({
  data,
  id,
  selectionType,
}: {
  data: {};
  id: string;
  selectionType: string;
}) => {
  const response = await axios.post(
    `/api/management/post-update-select-drop-down-options`,
    {
      ...data,
      id,
      selectionType,
    }
  );
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.updatedRecord;
};

export const httpPostSelectedUser = async ({ id }: { id: string }) => {
  const response = await axios.post("/api/users/post-selected-user", { id });
  return response.data[0];
};

export const httpPostInsertUser = async ({ data }: { data: {} }) => {
  const response = await axios.post(`/api/users/post-insert-user`, data);
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.newRecord;
};

export const httpPostUpdateUser = async ({
  data,
  id,
}: {
  data: {};
  id: string;
}) => {
  const response = await axios.post(`/api/users/post-update-user`, {
    ...data,
    id,
  });
  // @ts-ignore
  toast[response.data.status](response.data.message);
  return response.data.updatedRecord;
};

export const httpPostDeleteSelectDropDownOptions = async ({
  id,
  selectionType,
}: {
  id: string;
  selectionType: string;
}) => {
  const response = await axios.post(
    `/api/management/post-delete-select-drop-down-options`,
    { id, selectionType }
  );
  return response;
};

export const httpPostDeleteExaminer = async ({
  id,
  selectionType,
}: {
  id: string;
  selectionType: string;
}) => {
  const response = await axios.post(`/api/examiners/post-delete-examiner`, {
    id,
    selectionType,
  });
  return response;
};

export const httpPostDeleteInsTitle = async ({ id }: { id: string }) => {
  const response = await axios.post(`/api/titles/post-delete-ins-title`, {
    insTitleId: id,
  });
  return response;
};

export const httpPostInsTitlesInfo = async ({ inmbr }: { inmbr: string }) => {
  const response = await axios.post(`/api/titles/post-ins-titles-info`, {
    inmbr,
  });
  return {
    titles: response.data.titles,
    count: response.data.count,
  };
};

export const httpPostPropertiesInfo = async ({ cnmbr }: { cnmbr: string }) => {
  const response = await axios.post(`/api/clients/post-properties-info`, {
    c_number: cnmbr,
  });
  return response.data;
};

export const httpPostBuyerSellerInfo = async ({
  compRef,
}: {
  compRef: string;
}) => {
  const response = await axios.post(`/api/buyerseller/post-buyer-seller-info`, {
    p_comp_ref: compRef,
  });
  return response.data;
};

export const httpPostDeleteUser = async ({
  id,
  selectionType,
}: {
  id: string;
  selectionType: string;
}) => {
  const response = await axios.post(`/api/users/post-delete-user`, {
    id,
    selectionType,
  });
  return response;
};

export const httpPostLogin = async ({ data }: { data: {} }) => {
  const response = await axios.post(`/api/auth/post-login`, { ...data });
  return response;
};

export const httpPostSearchClient = async ({ data }: { data: {} }) => {
  const response = await axios.post(`/api/clients/post-search-client`, data);
  return response.data;
};

export const httpPostPropertyReport = async ({ data }: { data: {} }) => {
  const response = await axios.post(`/api/reports/post-property-report`, data);
  return response;
};
