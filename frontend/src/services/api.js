import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-omnistack-semana6.herokuapp.com',
});

export default api;
