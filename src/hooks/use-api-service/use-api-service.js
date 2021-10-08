import axios from "axios";
import { useAuth } from "oidc-react";
import { AirviewApiError } from "../../lib/error";

export function useApiService() {
  const { userData, userManager } = useAuth();

  const callApi = (token, endpoint, method, data) => {
    const headers = {
      Authorization: "Bearer " + token,
    };

    return axios({
      method: method,
      url: endpoint,
      headers: headers,
      data: data,
      responseType: "blob",
    });
  };

  const callApiHelper = async (resource, method = "get", data = {}) => {
    const endpoint = `${process.env.REACT_APP_API_HOST}${resource}`;

    if (userData && userData?.access_token) {
      try {
        return await callApi(userData.access_token, endpoint, method, data);
      } catch (error) {
        if (error.response.status === 401) {
          const renewedUser = await userManager.signinSilent();
          return await callApi(
            renewedUser.access_token,
            endpoint,
            method,
            data
          );
        }

        throw new AirviewApiError(error, error.response.status);
      }
    } else if (userData) {
      try {
        const renewedUser = await userManager.signinSilent();
        return await callApi(renewedUser.access_token, endpoint, method, data);
      } catch (error) {
        throw new AirviewApiError(error, error.response.status);
      }
    } else {
      throw new AirviewApiError("user is not logged in");
    }
  };

  return callApiHelper;
}
