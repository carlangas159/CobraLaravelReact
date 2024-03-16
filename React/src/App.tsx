import './App.css'
import ListaTareas from "./components/ListaTareas.tsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {axiosService} from "./axiosService.tsx";
import Login from "./components/Login.tsx";
function App() {
    const [user, setUser] = useState({email:"",password:"",token:""});
    const checkUser = () => {
        let o = localStorage.getItem('token')??"";
        if (o === "undefined") o ="";

        if (o.length > 2) {
            readUser()
            return true;
        }
        return false
    }

    const readUser = async () => {
        let o = localStorage.getItem('user')??""
        if (o === "undefined") o ="";
        if (o.length > 2 ) {
            setUser(JSON.parse(o))
            return true;
        }
        return false;
    };

    useEffect(() => {

        checkUser()
    }, []);
  return (
    <>
        <div>
            <h1>App Tareas</h1>
            <p>Aquí se mostrarán las tareas.</p>
            { user!== undefined && user.token && user.token.length>3  ? (

            <ListaTareas/>
            ) : (
                <div className="container">
                    <Login user={user} checkUser={checkUser} setUser={setUser} readUser={readUser}/>
                </div>

            )}
        </div>
    </>
  )
}

export default App