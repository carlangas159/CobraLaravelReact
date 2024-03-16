import './App.css'
import ListaTareas from "./components/ListaTareas.tsx";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore
import React, {useEffect, useState} from "react";
import Login from "./components/Login.tsx";
function App() {
    const [user, setUser] = useState({email:"demo@demo.com",password:"demo",token:""});
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
            { user!== undefined && user.token && user.token.length>3  ? (

            <ListaTareas user={user}/>
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