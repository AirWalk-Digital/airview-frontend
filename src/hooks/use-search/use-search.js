import { useApiService } from "../use-api-service";

export function useSearch() {
  const apiService = useApiService();

  return async function (query) {
    try {
      const response = await apiService(`/api/search/?q=${query}`);

      if (!response.statusText === "OK") {
        throw new Error("Sorry, something has gone wrong. Please try again");
      }

      const results = await response.data.text();

      return JSON.parse(results);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
