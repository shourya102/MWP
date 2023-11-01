import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import UserAuth from "./pages/UserAuth/UserAuth";
import {useEffect, useState} from "react";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Room from "./pages/Room/Room";
import {SocketProvider} from "./socket/Socket";

const App = () => {
    const [path, setPath] = useState('');
    const [bgState, setBgState] = useState('bg-black');

    useEffect(() => {
        switch (path.pathname) {
            case '/auth':
            case '/auth/signup':
            case '/auth/signin':
                setBgState('bg-img-1');
                break;
            default:
                setBgState('bg-black');
        }
    }, [path]);

    return (
        <div className={`App max-h-screen max-w-screen ${bgState} font-inter text-text-1 overflow-y-scroll`}>
            <SocketProvider>
                <Router>
                    <Routes>
                        <Route path={'/'} element={<Home setPath={setPath}/>}/>
                        <Route path={'/auth/'} element={<UserAuth setPath={setPath}/>}>
                            <Route path={'/auth/signin'} element={<SignIn/>}></Route>
                            <Route path={'/auth/signup'} element={<SignUp/>}></Route>
                        </Route>
                        <Route path={'/room/:roomId'} element={<Room/>}></Route>
                    </Routes>
                </Router>
            </SocketProvider>
        </div>
    );
}

export default App;
