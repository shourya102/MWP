import React, {useState} from 'react';
import './SignIn.css';
import WordBetween from "../Styled/WordBetween/WordBetween";
import {BiLogoFacebook, BiLogoGoogle, BiLogoInstagram, BiLogoTwitter} from "react-icons/bi";
import {IconContext} from "react-icons";
import {Link, useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";

const SignIn = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const logIn = (e) => {
        e.preventDefault();
        UserService.userSignIn(username, password);
        navigate('/');
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex space-x-3">
                    <h1 className="font-questrial font-bold text-title-2">Sign <span className="text-blue-500">in</span>
                    </h1>
                    <div className="w-6 h-6 look1 rounded-full bg-white translate-y-5"></div>
                </div>
                <h2 className="font-varela-round font-light text-paragraph-3 text-text-3 md:text-text-2">Start watching
                    now!</h2>
            </div>
            <div className="flex flex-col space-y-5 pb-1">
                <div className="flex flex-col mt-3">
                    <label htmlFor="username" className="ml-3">Username</label>
                    <input type="text"
                           value={username}
                           placeholder={'Username'}
                           id='username'
                           className="bg-gray-50 bg-opacity-50 text-text-2 p-2 rounded-3xl"
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="ml-3">Password</label>
                    <input type="password"
                           value={password}
                           placeholder={'Password'}
                           id='password'
                           className="bg-gray-50 bg-opacity-50 text-text-2 p-2 rounded-3xl"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="flex">
                    <button onClick={logIn}
                            className="flex-grow bg-gradient-to-l from-blue-900 to-blue-700 p-2 rounded-3xl">Let's go!
                    </button>
                </div>
                <div className="flex text-paragraph-4 justify-between text-text-4">
                    {/*<button className="mt-1 hover:text-blue-700" onClick={() => props.setLogin(false)}>Don't have an account?</button>*/}
                    <Link to='/auth/signup' className="mt-1 hover:text-blue-700">Don't have an account?</Link>
                    <Link className="hover:text-blue-700" to={'/'}>Forgot password?</Link>
                </div>
            </div>
            <div className="flex flex-col">
                <div><WordBetween width={9} color={'#555'}>or</WordBetween></div>
                <div className="flex justify-center space-x-4 mt-3">
                    <IconContext.Provider value={{size: '30'}}>
                        <Link to={'/'} className="hover:bg-orange-600 p-1 rounded-full"><BiLogoGoogle/></Link>
                        <Link to={'/'} className="hover:bg-pink-700 p-1 rounded-full"><BiLogoInstagram/></Link>
                        <Link to={'/'} className="hover:bg-blue-500 p-1 rounded-full"><BiLogoFacebook/></Link>
                        <Link to={'/'} className="hover:bg-blue-600 p-1 rounded-full"><BiLogoTwitter/></Link>
                    </IconContext.Provider>
                </div>
            </div>
        </>
    );
};

export default SignIn;