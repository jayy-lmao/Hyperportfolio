import axios from 'axios';

/**
 * Creates a link to the api
 */
export default axios.create({
  baseURL: '/api',
});
