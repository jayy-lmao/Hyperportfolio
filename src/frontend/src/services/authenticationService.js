import {
  BehaviorSubject,
} from 'rxjs';
import handleResponse from '../helpers/handleResponse';
import authHeader from '../helpers/authHeader';
import stocksDjango from '../apis/stocksDjango';

/**
 * Retrieves the current header of the request
 */
const headerObj = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

/**
 * **Authentication Service** is for handling JWT tokens in order to log in/out.
 * It also refreshes the JWT active token by means of request with a refresh token.
 */
class AuthenticationService {
  currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser')),
  );

  /**
   * Retrieve observable result for current user
   */
  currentUser = this.currentUserSubject.asObservable()

  /**
   * Get the current user subect
   * @return {String} the user subject
   */
  get currentUserValue() {
    return this.currentUserSubject.value;
  }


  /**
   * @param {string} email user email address or username
   * @param {string} password user password
   * @return {forminfo} details containing form information
   */
  getLoginFormData = (email, password) => {
    const details = new FormData();
    details.set('username', email);
    details.set('password', password);
    return details;
  };

  /**
   * @param {string} username user username
   * @param {string} email user email address
   * @param {string} password user password
   * @param {string} firstName user firstName
   * @param {string} lastName user lastName
   * @return {formData} details some x-form formatted data
   */
  getRegisterFormData = (
    username, email, password, firstName, lastName,
  ) => {
    const details = new FormData();
    details.set('username', username);
    details.set('email', email);
    details.set('password', password);
    details.set('first_name', firstName);
    details.set('last_name', lastName);
    return details;
  };

  /**
   * @param {string} username user username
   * @param {function} callback - a function to run on completion
   */
  getUserDetails = async (username, callback) => {
    await stocksDjango.get('/users/', {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        callback(
          data.filter(
            x => x.username === username || x.email === username,
          )[0],
        );
      })
      .catch(err => console.log(err));
  };

  /**
   * @param {user} user a user object to set current user as
   */
  setCurrentUser = (user) => {
    /* store user details and jwt token in locaindiiduall storage
      to keep user logged in between page refreshes */
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  };

  /**
   * Gets jwt from user login, and set's current user with those returned tokens
   * @param {string} email user email address
   * @param {string} password user password
   * @param {function} onSuccess function to call after executing succeeds
   * @param {function} onFailure function to call after executing fails
   * @return {null} null
   */
  login = async (email, password, onSuccess, onFailure) => {
    await stocksDjango.post('/login/',
      this.getLoginFormData(email, password), headerObj)
      .then(handleResponse)
      .then(async (user) => {
        await this.getUserDetails(email,
          details => this.setCurrentUser({
            firstName: details.first_name,
            ...user,
          }));
      })
      .then(() => onSuccess())
      .catch(() => onFailure());
  };

  /**
   * Gets jwt from user registration
   * and set's current user with those returned tokens
   * @param {string} username - user username
   * @param {string} email - user email address
   * @param {string} password - user password
   * @param {string} firstName - user firstName
   * @param {string} lastName - user lastName
   * @param {function} onSuccess - function to call after executing succeeds
   * @param {function} onFailure - function to call after executing fails
   */
  register = async (
    username, email, password, firstName, lastName, onSuccess, onFailure,
  ) => {
    await stocksDjango.post(
      '/users/', this.getRegisterFormData(
        username, email, password, firstName, lastName,
      ), headerObj,
    )
      .then(handleResponse)
      .then(() => this.login(email, password, onSuccess, onFailure))
      .catch(() => onFailure());
  };


  /*
   * Retrieve a new token for user authentication
   */
  refresh = async () => {
    const refreshToken = this.currentUserSubject.value.refresh;
    const {
      firstName,
    } = this.currentUserSubject.value;
    const refreshTokenData = new FormData();
    refreshTokenData.set('refresh', refreshToken);
    const newToken = await stocksDjango.post(
      '/login/refresh/', refreshTokenData, headerObj,
    )
      .then(handleResponse)
      .then((user) => {
        this.setCurrentUser({
          refresh: refreshToken,
          firstName,
          ...user,
        });
        return user;
      });
    return newToken;
  };

  /*
   * Logs the current user out
   */
  logout = () => {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  };
}

export default new AuthenticationService();
