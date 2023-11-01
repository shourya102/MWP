import React, {useState} from 'react';
import './UserAuth.css'
import {Route, Routes, useLocation} from "react-router-dom";
import SignIn from "../../components/SignIn/SignIn";
import SignUp from "../../components/SignUp/SignUp";
import Topbar from "../../components/Topbar/Topbar";

const UserAuth = (props) => {
    props.setPath(useLocation());
    const [login, setLogin] = useState(false);

    return (
        <>
            <Topbar/>
            <div className="UserAuth w-full flex md:justify-center">
                <div className="flex flex-col flex-grow md:flex-grow-0 md:w-96 h-[32rem] p-6 bg-transparent
            md:bg-white md:bg-opacity-50 backdrop-blur-md translate-y-14 md:shadow-2xl space-y-2">
                    {/*{login && <SignIn setLogin={setLogin}/>}*/}
                    {/*{!login && <SignUp setLogin={setLogin}/>}*/}
                    <Routes>
                        <Route path='signin' element={<SignIn/>}/>
                        <Route path='signup' element={<SignUp/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default UserAuth;