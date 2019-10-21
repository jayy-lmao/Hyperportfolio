import handleResponse from '../helpers/handleResponse';
import history from '../helpers/history';
import authHeader from '../helpers/authHeader';
import stocksDjango from '../apis/stocksDjango';

/**
 * Retrieves the current header of the request
 */
const getHeader = async () => ({
  headers: {
    ...await authHeader(),
    'content-type': 'multipart/form-data',
  },
});

/* 
 * Portfolio service is for creating/reading/updating
 * from the hyperportfol.io/api/watclists REST API.
 */
class PortfolioService {
  /**
   * Creates form data for creating a new portfolio
   * @param {string} name - name of the portfolio
   * @param {string} description - description of the portfolio
   * @returns {formData} formData 
   */
  getPortfolioFormData = (name, description) => {
    const summaries = new FormData();
    summaries.set('name', name);
    summaries.set('description', description);
    return summaries;
  };

  /**
   * Retrieves a form with given transaction data
   * @param {Object} contains information regarding requested transaction
   * @returns {formData} formData of transaction information
   */
  getTransactionFormData = ({
    price,
    symbol,
    units,
    date,
    portfolioId,
    transactionType,
  }) => {
    const transactionForm = new FormData();
    transactionForm.set('portfolio_id', portfolioId);
    transactionForm.set('symbol', symbol);
    transactionForm.set('price', price);
    transactionForm.set('units', units);
    transactionForm.set('transaction_date', date);
    transactionForm.set('transaction_type_id', transactionType);
    return transactionForm;
  };


  /**
   * Edits  portfolio with the given information
   * @param {string} name - name of the portfolio
   * @param {string} description - description of the portfolio
   * @param {string} id - id of the portfolio being edited
   * @param {function} callback - a function to run on completion
   */
  editPortfolio = async (name, description, id, callback) => {
    await stocksDjango.put(
      `/portfolios/${id}/`,
      this.getPortfolioFormData(name, description),
      await getHeader(),
    )
      .then(handleResponse)
      .then(data => callback(data))
      .catch(err => console.log(err));
  };

  /**
   * Deletes a transaction within a portfolio
   * @param {string} id - id of the portfolio being edited
   * @param {function} callback - a function to run on completion
   */
  deletePortfolioTransaction = async (id, callback) => {
    await stocksDjango.delete(
      `/portfoliotransactions/${id}`,
      await getHeader(),
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


  /**
   * Deletes a given portfolio
   * @param {string} id - id of the portfolio being deleted
   * @param {function} callback - a function to run on completion
   */
  deletePortfolio = async (id, callback) => {
    await stocksDjango.delete(
      `/portfolios/${id}`,
      await getHeader(),
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

  /**
   * Retreieves a portfolio for editing
   * @param {string} id - id of the portfolio being edited
   * @param {function} callback - a function to run on completion
   */
  getPortfolio = async (id, callback) => {
    await stocksDjango.get(`/portfolios/${id}`, {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        callback(data);
      });
  };

  /**
   * Retreieves multiple portfolios
   * @param {function} callback - a function to run on completion
   */
  getPortfolios = async (callback) => {
    await stocksDjango.get('/portfolios/', {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        callback(data);
      });
  };

  /** 
   * Retrieves all transactions within a portfolio
   * @param {function} callback - a function to run on completion
   */
  getAllTransactions = async (callback) => {
    await stocksDjango.get('/portfoliotransactions', {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((transactions) => {
        callback(transactions);
      })
      .catch((err) => {
        history.push('/');
        console.log(err);
      });
  };

  /**
   * Gets transactions of an instrument within a portfolio
   * @param {string} matchId - id of the portfolio being viewed
   * @param {string} code - Stock symbol to get transactions for
   * @param {function} callback - a function to run on completion
   */
  getPortfolioInstrumentTransactions = async (matchId, code, callback) => {
    await stocksDjango.get(
      `/portfolios/${matchId}/summaries/${code}/transactions/`, {
        headers: await authHeader(),
      },
    )
      .then(handleResponse)
      .then((portfolio) => {
        callback(portfolio);
      })
      .catch((err) => {
        history.push(`/portfolios/${matchId}`);
        console.log(err);
      });
  };

  /**
   * Gets summaries of a given portfolio
   * @param {string} matchId - id of the portfolio being viewed
   * @param {function} callback - a function to run on completion
   */
  getPortfolioSummaries = async (matchId, callback) => {
    await stocksDjango.get(`/portfolios/${matchId}/summaries/`, {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((portfolio) => {
        callback(portfolio);
      })
      .catch((err) => {
        history.push('/portfolios');
        console.log(err);
      });
  };

  /**
   * Gets symbols within a portfolio
   * @param {function} callback - a function to run on completion
   */
  getOwnerPortfolioSummarySymbols = async (callback) => {
    await stocksDjango.get('/ownerportfolios/', {
      headers: await authHeader(),
    })
      .then(handleResponse)
      .then((data) => {
        callback(data);
      });
  };

  /** 
   * Creates a transaction within a portfolio
   * @param {string} id - id of the portfolio being edited
   * @param {function} callback - a function to run on completion
   */
  createTransaction = async (transaction, callback) => {
    await stocksDjango.post(
      '/portfoliotransactions/',
      this.getTransactionFormData(transaction),
      await getHeader(),
    )
      .then(handleResponse)
      .then(data => callback(data))
      .catch(err => console.log(err));
  };

  /**
   * Creates a portfolio with the given information
   * @param {string} name - name of portfolio to be added
   * @param {string} description - description of portfolio to be added
   * @param {function} callback a function to run on completion
   */
  createPortfolio = async (name, description, callback) => {
    await stocksDjango.post(
      '/portfolios/',
      this.getPortfolioFormData(name, description),
      await getHeader(),
    )
      .then(handleResponse)
      .then(() => callback())
      .catch(err => console.log(err));
  };
}

export default new PortfolioService();
