import axios from "axios";
import constants from "../utils/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default class {
  static get = async (token, obj) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/getUsers`, obj, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getTotalUsers = async (token) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/totalUsers`, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getById = async (id) => {
    let result = { data: null, error: null };
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/${id}`)
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static signup = async (token, obj) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/create`, obj, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static login = async (data) => {
    let result = { data: null, error: null };
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/signin`, data)
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static forgotPassword = async (email) => {
    let result = { data: null, error: null };
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/forgot-password`, {
        email: email,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static resetPassword = async (token, password) => {
    let result = { data: null, error: null };
    const data = {
      token: token,
      newPassword: password,
    };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/reset-password`, data)
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static updatePassword = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/update-password`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static restorePassword = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/restore-password`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static deleteUserById = async (id) => {
    let result = { data: null, error: null };
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/users/${id}`)
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static updateIsUserBlocked = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/blocked`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static updateIsUserActive = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/active`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static updateName = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/name/`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static addPoints = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/points/`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };
}
