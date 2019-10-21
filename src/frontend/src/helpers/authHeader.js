import jwtDecode from 'jwt-decode';
import authenticationService from '../services/authenticationService';
import history from './history';

/**
 * authHeader uses the current locally-stored [observable](https://rxjs-dev.firebaseapp.com/guide/observable) in order to retrieve the [jwt-token (RFC7519)](https://jwt.io/) used for authentication for the current client-server session. It  will return an object used for setting the `Authorization` header of future requests to the hyperportfol.io REST API. If the active-token has expired it will request a new one using the refresh-token.
 * @returns {Object} authorizationHeader - An object with
 * an property "Authorization" which stores a string with `Bearer + <token>`;
 */
const authHeader = async () => {
  let newToken = '';
  const { currentUserValue } = authenticationService;
  if (currentUserValue) {
    const { exp } = jwtDecode(currentUserValue.access);
    /* Logout if access has expired */
    if (Date.now() >= exp * 1000) {
      const newUser = await authenticationService.refresh()
        .catch(() => {
          authenticationService.logout();
          history.push('/');
        });
      /* Create a new token upon new user access */
      if (newUser) {
        newToken = newUser.access;
      }
    }
    return { Authorization: `Bearer ${newToken || currentUserValue.access}` };
  }
  return {};
};


export default authHeader;
