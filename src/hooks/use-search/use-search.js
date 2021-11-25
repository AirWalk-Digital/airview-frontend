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
      const parsed = JSON.parse(results);
      return parsed.map((item) => ({
        ...item,
        path: item.path.substring(0, item.path.lastIndexOf("/")),
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
