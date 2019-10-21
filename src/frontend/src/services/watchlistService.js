import handleResponse from '../helpers/handleResponse';
import history from '../helpers/history';
import authHeader from '../helpers/authHeader';
import stocksDjango from '../apis/stocksDjango';

/**
 * Watchlist service is for creating/reading/updating
 * from the hyperportfol.io/api/watclists REST API.
 */
class WatchListService {
  /**
   * Creates form data for creating a new watchlist.
   * @param {string} name - name of the watchlist
   * @param {string} description - description of the watchlist
   * @returns {Object} watchlistFormData - x-form encoded data
   */
  getWatchlistFormData = (name, description) => {
    const watchlistFormData = new FormData();
    watchlistFormData.set('name', name);
    watchlistFormData.set('description', description);
    return watchlistFormData;
  };

  /**
   * Creates form data for creating a new watchlist detail.
   * @param {number} id - id of watchlist to add detail to
   * @param {string} symbol - symbol of detail getting added to watchlist
   * @returns {Object} detailFormData - x-form encoded data
   */
  getWatchlistDetailsFormData = (id, symbol) => {
    const detailFormData = new FormData();
    detailFormData.set('watchlist_id', id);
    detailFormData.set('symbol', symbol);
    return detailFormData;
  };

  /**
   * Retrieves Authentication Header and adds header to state the content is form data
   * @returns {Object} headers - headers for POST requests to Django server
   */
  getHeader = async () => ({
    headers: {
      ...await authHeader(),
      'content-type': 'multipart/form-data',
    },
  });

  /**
   * Updates the information of a watchlist.
   * @param {string} name - name of the watchlist
   * @param {string} description - description of the watchlist
   * @param {string} id - id of the watchlist being edited
   * @param {function} callback - a function to run on completion
   */
  editWatchlist = async (name, description, id, callback) => {
    await stocksDjango.put(
      `/watchlists/${id}/`,
      this.getWatchlistFormData(name, description),
      await this.getHeader(),
    )
      .then(handleResponse)
      .then((data) => {
        callback(data);
      })
      .catch(err => console.log(err));
  };

  /**
   * Sends a delete request for a watchlist.
   * @param {string} id - id of the watchlist being edited
   * @param {function} callback - a function to run on completion
   */
  deleteWatchlist = async (id, callback) => {
    await stocksDjango.delete(
      `/watchlists/${id}`,
      await this.getHeader(),
    )
      .then(handleResponse)
      .then(() => {
        // console.log(data)
        callback();
      })
      .catch((err) => {
        console.log('an error deleting');
        console.log(err);
      });
  };

  /*
   * Deletes given details from a watchlist
   * @param {String} id - the id of the watchlist which is being deleted from
   */
  deleteWatchlistDetails = async (id) => {
    await stocksDjango.delete(
      `/watchlistdetails/${id}`,
      await this.getHeader(),
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Gets all watchlists for a given user associated with JWT token.
   * @param {function} callback - a function to run on completion
   * @param {Object} cancelToken - Used to identify this request to cancel when needed.
   */
  getWatchlists = async (callback, cancelToken) => {
    await stocksDjango.get('/watchlists/', {
      headers: await authHeader(),
      cancelToken,
    })
      .then(handleResponse)
      .then((data) => {
        callback(data);
      });
  };

  /**
   * Retrieves watchlist details
   * @param {string} matchId - id of the watchlist being deleted
   * @param {function} callback - a function to run on completion
   */
  getWatchlistDetails = async (matchId, callback) => {
    await stocksDjango.get(`/watchlists/${matchId}/details/`, {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((watchlist) => {
        if (watchlist) {
          callback(watchlist, matchId);
        }
      })
      .catch((err) => {
        history.push('/watchlists');
      });
  };

  /**
   * Retreieves all watchlist details
   * @param {function} callback - a function to run on completion
   * @param {Object} cancelToken - Used to identify this request to cancel when needed.
   */
  getAllWatchlistDetails = async (callback, cancelToken) => {
    await stocksDjango.get('/watchlistdetails/', {
      headers: await authHeader(),
      cancelToken,
    })
      .then(handleResponse)
      .then((details) => {
        if (callback) {
          callback(details);
        } else {
          console.log(details);
        }
      })
      .catch((err) => {
        if (!('message' in err)) {
          console.log(err);
          history.push('/watchlists');
        }
      });
  };

  /**
   * Creates a watchlist using the given details
   * @param {Object} - details to add to watchlist
   */
  createWatchlistDetails = async ({
    symbol,
    watchlistId,
    onSuccess,
    onFail,
  }) => {
    await stocksDjango.post(
      '/watchlistdetails/',
      this.getWatchlistDetailsFormData(watchlistId, symbol),
      await this.getHeader(),
    )
      .then(handleResponse)
      .then(data => onSuccess(data))
      .catch((err) => {
        if (onFail) {
          onFail(err);
        } else {
          history.push('/watchlists');
          console.log(err);
        }
      });
  };

  /**
   * Wrapper to create a watchlist
   * @param {String} name - the name of the watchlist to create
   * @param {String} description - the description of the watchlist to add
   * @param {function} callback - a function to run on completion
   */
  createWatchlist = async (name, description, callback) => {
    await stocksDjango.post(
      '/watchlists/',
      this.getWatchlistFormData(name, description),
      await this.getHeader(),
    )
      .then(handleResponse)
      .then(data => callback(data))
      .catch(err => console.log(err));
  };
}

export default new WatchListService();
