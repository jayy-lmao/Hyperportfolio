import handleResponse from '../helpers/handleResponse';
import stocksDjango from '../apis/stocksDjango';
import authHeader from '../helpers/authHeader';

/*
 * Instrument service is for creating/reading/updating
 * from the hyperportfol.io/api/watclists REST API.
 */
class InstrumentService {
  /**
   * Searches for an instrument with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.searchRegion - optional region of instrument
   * @param {String} request.searchQuery - search query from user
   * @param {function} request.onSuccess - Callback to run if request succeeds
   * @param {Object} request.cancelToken - Used to identify this request to cancel when needed.
   */
  search = async ({
    searchRegion,
    searchQuery,
    cancelToken,
    onSuccess,
  }) => {
    const params = {
      lang: 'en',
      query: searchQuery,
    };
    /* Load search region if one is given */
    if (searchRegion) {
      params.region = searchRegion;
    }
    stocksDjango.get('/instruments', {
      params,
      cancelToken,
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((instruments) => {
        if (onSuccess) {
          onSuccess(instruments);
        } else {
          console.log(instruments);
        }
      })
      .catch(() => {});
  };

  /**
   * Searches for an instrument's newsfeed with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.region - region of instrument for news
   * @param {String} request.symbol - symbol of instrument to find newsfeed for
   * @param {function} request.callback - a function to run on success
   */
  news = async ({
    region,
    symbol,
    callback,
  }) => {
    const params = {
      lang: 'en',
    };
    if (region) {
      params.region = region;
    }
    stocksDjango.get(`/instruments/${symbol}/news`, {
      params,
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((newsInfo) => {
        if (callback) {
          callback(newsInfo);
        } else {
          console.log(newsInfo);
        }
      });
  };

  /**
   * Searches for an instrument's financial data with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.symbol - symbol of instrument to find financial data for
   * @param {function} request.callback - a function to run on success
   */
  financials = async ({
    symbol,
    callback,
  }) => {
    const params = {
      lang: 'en',
    };
    stocksDjango.get(`/instruments/${symbol}/financialstatements/`, {
      params,
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((financialInfo) => {
        if (callback) {
          callback(financialInfo);
        } else {
          console.log(financialInfo);
        }
      });
  };

  /**
   * Searches for an instrument's quotes with the given data
   * @param {Object} request- the descriptors of the instrument to find
   * @param {String} request.symbols - symbols of instruments to find quotes for
   * @param {function} request.callback - a function to run on success
   * @param {Object} request.cancelToken - Used to identify this request to cancel when needed.
   */
  quotes = async ({
    symbols,
    callback,
    cancelToken,
  }) => {
    stocksDjango.get(`/instruments/${symbols.join()}`, {
      headers: await authHeader(),
      cancelToken,
    })
      .then(handleResponse)
      .then((quoteData) => {
        if (callback && quoteData.quoteResponse) {
          callback(quoteData.quoteResponse);
        } else {
          console.log(quoteData);
        }
      })
      .catch(() => {});
  };

  /**
   * Searches for an instrument's charting data with the given data
   * @param {Object} - the descriptors of the instrument to find
   * @param {String} request.region - region of instrument for chart
   * @param {String} request.symbol - symbol of instrument to find chart data for
   * @param {int} request.interval - interval of desired chart
   * @param {int} request.range - time period over which to chart
   * @param {String} request.lang - language of charting data
   * @param {function} request.callback - a function to run on success
   */
  chart = async ({
    region,
    symbol,
    interval,
    range,
    lang,
    callback,
  }) => {
    stocksDjango.get(`instruments/${symbol}/charts`, {
      params: {
        region,
        symbol,
        interval: interval || '5m',
        range: range || '1d',
        lang: lang || 'en',
      },
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        if (callback) {
          callback(data);
        } else {
          console.log(data);
        }
      })
      .catch(err => console.log(err));
  };

  /**
   * Searches for an instrument's charting data, formatte to be compatible
   * with a multi-type chart with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.region - region of instrument for chart
   * @param {String} request.symbol - symbol of instrument to find chart data for
   * @param {int} request.interval - interval of desired chart
   * @param {int} request.range - time period over which to chart
   * @param {String} request.lang - language of charting data
   * @param {Object} request.comparisons - relative comparisons for multi-chart
   * @param {function} request.callback - a function to run on success
   * @param {Object} request.cancelToken - Used to identify this request to cancel when needed.
   */
  chartmulti = async ({
    region,
    symbol,
    interval,
    range,
    lang,
    comparisons,
    callback,
    cancelToken,
  }) => {
    stocksDjango.get(`instruments/${symbol}/chartsmulti`, {
      params: {
        region,
        symbol,
        interval: interval || '5m',
        range: range || '1d',
        lang: lang || 'en',
        comparisons,
      },
      cancelToken,
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        if (callback) {
          callback(data);
        } else {
          console.log(data);
        }
      })
      .catch(() => {});
  };

  /**
   * Searches for an instrument's company with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.symbol - symbol of instrument to find company data for
   * @param {function} request.callback - a function to run on success
   */
  company = async ({
    symbol,
    callback,
  }) => {
    stocksDjango.get(`instruments/${symbol}/company`, {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        if (callback) {
          callback(data);
        } else {
          console.log(data);
        }
      });
  };

  /**
   * Searches for an instrument's markets with the given data
   * @param {Object} request - the descriptors of the instrument to find
   * @param {String} request.region - region of instrument to find markets within
   * @param {String} request.lang - language of relevant markets
   * @param {function} request.callback - a function to run on success
   * @param {Object} request.cancelToken - Used to identify this request to cancel when needed.
   */
  markets = async ({
    region,
    lang,
    callback,
    cancelToken,
  }) => {
    stocksDjango.get('markets', {
      params: {
        region: region || 'AU',
        lang: lang || 'en',
      },
      headers: await authHeader(),
      cancelToken,
    })
      .then(handleResponse)
      .then((data) => {
        if (callback) {
          callback(data);
        } else {
          console.log(data);
        }
      })
      .catch(() => {});
  };
}

export default new InstrumentService();
