import axios from 'axios';

 const axiosService = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'X-XSRF-TOKEN': localStorage.getItem('XSRF-TOKEN'),
    },
});
axiosService.interceptors.request.use((config) => {
    config.headers['X-CSRFToken'] = localStorage.getItem('XSRF-TOKEN');
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return config;
});
export const removeLog = ()=>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('token')
    localStorage.removeItem('XSRF-TOKEN');
}
export default  axiosService;