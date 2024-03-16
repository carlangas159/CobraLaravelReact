import React, {useEffect, useState} from 'react';

import 'jquery/dist/jquery.min.js';
import axios from "axios";
import {axiosService, removeLog} from "../axiosService.tsx";

//Datatable Modules

const Login = ({user, setUser,checkUser,readUser}) => {
    // const [user, setUser] = useState((new User()));

    const [email, setEmail] = useState(user!==null ? user.email:"");
    const [password, setPassword] = useState(user!==null ? user.password:"");
    
    useEffect(() => {
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        await axios.post(`http://localhost:8000/api/login`, {
            'email':email,
            'password':password,
        })
            .then(r =>{
                let t = r.data;
                console.error(t)
                localStorage.setItem('user',JSON.stringify(t))
                localStorage.setItem('token',JSON.stringify(t.token));
                 getSanctum();

            }).catch(er =>{
                let r = er.response
                removeLog();
                try {
                    alert(r.data.message)
                }
                catch (erw) {
                    // do not
                }
        });


    };
    const getSanctum = async ()=>{
        axiosService.defaults.headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
        const response = await axiosService.get('http://localhost:8000/sanctum/csrf-cookie');
        console.error(response)
        localStorage.setItem('XSRF-TOKEN', response.data.csrf_token)

        axiosService.defaults.headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'X-XSRF-TOKEN': localStorage.getItem('XSRF-TOKEN'),
        }
        readUser();
    }


    return (
        <div className="MainDiv">

            <div className="container">
                    <form onSubmit={handleSave} >


                    <label htmlFor="title">Correo:</label>
                    <input className="form-control" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input className="form-control" type="password" id="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} required/>
                    <br/>
                    <button type="submit" className="btn btn-secondary">Guardar</button>



                </form>
                
            </div>
        </div>
    );
};

export default Login;