import axios from 'axios';

const PORT = 5001;

const api = axios.create({
  baseURL: `http://localhost:${PORT}`
});

export default api;