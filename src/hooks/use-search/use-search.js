import { useApiService } from "../use-api-service";

export function useSearch() {
  const apiService = useApiService();

  return async function (query) {
    try {
      const response = await apiService(`/search/?q=${query}`);

      console.log(response);

      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
