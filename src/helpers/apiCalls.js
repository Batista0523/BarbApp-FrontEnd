import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const handleResponse = (response) => {
  const data = response.data;
  if (data) {
    return data;
  } else {
    console.error("Unexpected response format:", response.data);
    throw new Error("Unexpected response format");
  }
};

const handleError = (error) => {
  console.error(error);
  throw error;
};

const fetchAllItems = (endpoint) => {
  return axios
    .get(`${baseURL}/${endpoint}`)
    .then(handleResponse)
    .catch(handleError);
};

const fetchOneItem = (id, endpoint) => {
  return axios
    .get(`${baseURL}/${endpoint}/${id}`)
    .then(handleResponse)
    .catch(handleError);
};

const addItem = (endpoint, data) => {
  return axios
    .post(`${baseURL}/${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const updateItem = (endpoint, id, data) => {
  return axios
    .put(`${baseURL}/${endpoint}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const deleteItem = (endpoint, id) => {
  return axios
    .delete(`${baseURL}/${endpoint}/${id}`)
    .then(handleResponse)
    .catch(handleError);
};

export { fetchAllItems, fetchOneItem, addItem, updateItem, deleteItem };
