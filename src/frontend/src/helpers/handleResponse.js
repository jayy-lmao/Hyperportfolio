import authenticationService from '../services/authenticationService';

/**
 * Handles a response depending on data inputted
 * @param {bject} response - holds all relevant response data
 */
const handleResponse = (response) => {
  const { data } = response;
  if (!response.statusText) {
    if ([401, 403].includes(response.status)) {
      authenticationService.logout();
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
  }

  return data;
};

export default handleResponse;
