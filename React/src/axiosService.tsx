import axios from 'axios';

export const axiosService = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'X-XSRF-TOKEN': localStorage.getItem('XSRF-TOKEN'),
    },
});

export const removeLog = ()=>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('token')
    localStorage.removeItem('XSRF-TOKEN');
}