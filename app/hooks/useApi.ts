import { apiClient } from "@/api/apiClient";
import { useMemo } from "react";

export const useApi = () => {
  return useMemo(() => apiClient, []);
};

export const useApiClient = () => {
  return useMemo(() => apiClient, []);
};
