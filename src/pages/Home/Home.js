import React, {useCallback, useEffect, useState} from 'react';
import './Home.css'
import home_img from './home_img.png';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {BiLeftArrow, BiRightArrow} from "react-icons/bi";
import WordBetween from "../../components/Styled/WordBetween/WordBetween";
import Topbar from "../../components/Topbar/Topbar";
import Modal from "../../components/Modal/Modal";
import {AiFillExclamationCircle} from "react-icons/ai";
import {CgClose} from "react-icons/cg";
import {useSocket} from "../../socket/Socket";

const Home = (props) => {
    props.setPath(useLocation());
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    const socket = useSocket();
    const onRoomActivity = (e) => {
        e.preventDefault();
        setModal(true);
    }

    const [modal, setModal] = useState(false);
    const [displayName, setDisplayName] = useState('');

    const joinRoom = (e) => {
        e.preventDefault();
        socket.emit('joinRoom', JSON.stringify({displayName, roomId}));
    }

    const handleRoomJoin = useCallback(data => {
        const {name, roomId} = JSON.parse(data);
        navigate(`/room/${roomId}`);
    }, [navigate])

    useEffect(() => {
        socket.on('joinRoom', handleRoomJoin);
        return () => socket.off('joinRoom', handleRoomJoin);
    }, [handleRoomJoin, socket]);

    return (
        <>
            <Topbar/>
            <div className="Home max-w-screen flex p-6 flex-col md:mb-20 md:flex-row">
                <div className="flex flex-col max-w-xl md:mx-20 md:mt-20 space-y-6">
                    <div className="pb-6 border-down font-questrial text-title-2 md:text-title-1 flex">
                        <div className="flex justify-center p-4">
                            <div className="w-12 h-12 bg-white rounded-full look"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1>Watch alone.</h1>
                            <h1>Or with your friends.</h1>
                            <h1>Anytime, Anywhere.</h1>
                        </div>
                    </div>
                    <div
                        className="flex flex-grow justify-center space-x-3 bg-texture rounded-3xl p-6  font-varela-round text-text-2 text-paragraph-3 tracking-widest">
                        <div className="flex flex-col">
                            <div>
                                <Link className="hover:text-blue-700 cursor-pointer" to={'/'}>Have an account?</Link>
                            </div>
                            <div className="hidden md:flex flex-grow items-center justify-center">
                                <Link to={'/auth/signin'}
                                      className="bg-gradient-to-br from-orange-700 via-pink-700 via-45% to-blue-700 bg-orange-700 p-6 w-44 rounded-3xl text-text-1 text-center cursor-pointer">Sign
                                    In</Link>
                            </div>
                        </div>
                        <div className="flex flex-col space-x-2">
                            <WordBetween width={2}>or</WordBetween>
                            <div className="hidden md:flex flex-row justify-center translate-y-12">
                                <BiLeftArrow size={24}/>
                                <BiRightArrow size={24}/>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div>
                                <Link className="hover:text-orange-700 cursor-pointer" to={'/'}>New to this
                                    place?</Link>
                            </div>
                            <div className="hidden md:flex flex-grow items-center">
                                <Link to={'/auth/signup'}
                                      className="bg-gradient-to-br from-orange-700 via-pink-700 via-45% to-blue-700 bg-orange-700 p-6 w-44 rounded-3xl text-text-1 text-center cursor-pointer">Sign
                                    Up</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-grow justify-center space-y-6 m-6 md:m-0">
                    <div className="flex flex-col space-y-10">
                        <div className="flex justify-center">
                            <img src={home_img} alt="abc" className="w-72"></img>
                        </div>
                        <div className="font-questrial font-bold text-text-2 flex flex-col mt-12 text-title-3">
                            <h2 className="">Want to be anonymous? <span
                                className="text-orange-700">Create</span> or <span
                                className="text-blue-700">Join</span> a</h2>
                            <h2 className="">private room in one go</h2>
                        </div>
                        <div className="flex flex-col flex-grow md:flex-grow-0 md:flex-row md:space-x-4">
                            <div className="flex flex-col">
                                <label htmlFor="room-id" className="text-text-2 p-1 ml-2">Room ID:</label>
                                <input type="text"
                                       className="w-80 p-4 text-gray-900 rounded-3xl text-paragraph-2 focus:outline-gray-500"
                                       placeholder="xAYz123"
                                       id="room-id"
                                       value={roomId}
                                       onChange={(e) => setRoomId(e.target.value)}/>
                            </div>
                            <button
                                className="font-varela-round rounded-3xl mb-8 md:mb-0 p-4 md:p-0 w-44 text-center mt-7 bg-blue-700 hover:bg-blue-500"
                                onClick={onRoomActivity}>Enter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {modal && (
                <Modal action={() => setModal(false)}>
                    <div className="flex flex-col h-full font-questrial text-text-1">
                        <div className="flex justify-between pl-2 font-bold border-down-1 text-title-3">
                            <div className="flex items-center space-x-2">
                                <AiFillExclamationCircle/>
                                <span className="">Uh oh!</span>
                            </div>
                            <button onClick={() => setModal(false)} className="flex items-center pr-2"><CgClose/>
                            </button>
                        </div>
                        <div
                            className="flex flex-grow flex-col space-y-2 p-3 text-paragraph-2 text-text-3 font-normal border-down-1">
                            <span>It appears that a room with the ID
                                <span
                                    className="bg-white rounded-xl font-bold font-mono bg-opacity-20 p-1 mx-1">{roomId !== '' ? roomId : 'N/A'}</span> does not exist yet.</span>
                            <div>
                                <span>Would you like to create a new room?</span>
                            </div>
                            <input type="text"
                                   placeholder="What should be your Display Name?"
                                   required={true}
                                   className="px-3 py-2 rounded-3xl bg-white bg-opacity-20 font-inter focus:outline-gray-500 focus:shadow-xl"
                                   value={displayName}
                                   onChange={(e) => setDisplayName(e.target.value)}/>
                        </div>
                        <div className="flex p-2 text-paragraph-2 justify-end">
                            <div className="flex float-right space-x-2">
                                <button onClick={joinRoom} className="bg-white bg-opacity-20 p-2
                                rounded-2xl hover:bg-opacity-50 flex items-center">Create
                                </button>
                                <button onClick={() => setModal(false)} className="bg-white bg-opacity-20 p-2
                                rounded-2xl hover:bg-opacity-50 flex items-center">Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Home;