// @ts-ignore
import React, {useEffect, useState} from 'react';

import 'jquery/dist/jquery.min.js';
import axios from "axios";
import axiosService, {removeLog} from "../axiosService.tsx";

//Datatable Modules

// @ts-ignore
const Login = ({user, setUser,checkUser,readUser}) => {
    // const [user, setUser] = useState((new User()));

    const [email, setEmail] = useState(user!==null ? user.email:"demo@demo.com");
    const [password, setPassword] = useState(user!==null ? user.password:"demo");

    useEffect(() => {
    }, []);

    const handleSave = async (e:any) => {
        e.preventDefault();

        await axios.post(`http://localhost:8000/api/login`, {
            'email':email,
            'password':password,
        })
            .then(r =>{
                let t = r.data;
                console.error(t)
                localStorage.setItem('user',JSON.stringify(t))
                localStorage.setItem('token',(t.token));
                localStorage.setItem('XSRF-TOKEN', t.token)
                readUser();
                 // getSanctum();

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
    // @ts-ignore
    const getSanctum = async ()=>{
        const response = await axiosService.get('/sanctum/csrf-cookie');
        localStorage.setItem('XSRF-TOKEN', response.data.csrf_token)
        localStorage.setItem('XSRF-TOKEN', response.data.csrf_token)
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