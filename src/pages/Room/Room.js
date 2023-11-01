import React, {useCallback, useEffect, useRef, useState} from 'react';
import './Room.css';
import {useSocket} from "../../socket/Socket";
import RoomService from "../../services/RoomService";
import {
    AiFillAudio,
    AiFillCaretRight,
    AiFillDownCircle,
    AiFillExclamationCircle,
    AiFillMessage,
    AiFillVideoCamera
} from "react-icons/ai";
import {IconContext} from "react-icons";
import {BiSend} from "react-icons/bi";
import TextMessage from "../../components/TextMessage/TextMessage";
import {FaUsers} from "react-icons/fa";
import {HiStatusOnline} from "react-icons/hi";
import {BsThreeDots} from "react-icons/bs";
import {FcEndCall} from "react-icons/fc";
import ReactPlayer from "react-player";

const Room = () => {

    const player = useRef(null);
    const [localStream, setLocalStream] = useState(new MediaStream());
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('NOT_CONNECTED');
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    const [userJoined, setUserJoined] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [tab, setTab] = useState(1);
    const [hidden1, setHidden1] = useState(false);
    const [users, setUsers] = useState([]);
    const [showControls, setShowControls] = useState(false);
    const [linkSet, setLinkSet] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    const handlePlayAccept = () => {
        console.log(player);
        try {
            player.current.player.player.player.playVideo();
        } catch (e) {
            player.current.player.player.player.play();
        }
    };

    const handlePauseAccept = () => {
        console.log("pausing")
        try {
            player.current.player.player.player.pauseVideo();
        } catch (e) {
            player.current.player.player.player.pause();
        }
    };

    const handleVideoPlayed = useCallback(() => {
        socket.emit("play");
    }, [socket]);

    const handleVideoPaused = useCallback(() => {
        socket.emit("pause");
    }, [socket])

    const handleLinkChangeAccept = (link) => {
        setVideoLink(link);
    }

    const handleLinkChanged = useCallback((e) => {
        socket.emit("linkChanged", e.target.value)
    }, [socket]);

    const handleRoomCountChange = useCallback(({user, joined}) => {
        console.log(user, joined);
        if (joined) setUsers(prevState => [user, ...prevState]);
        else {
            setUsers(prevState => {
                return prevState.filter(item => item.sessionId !== user.sessionId);
            });
        }
    }, []);

    const handleAllUsersReceived = useCallback((allUsers) => {
        setUsers([...allUsers]);
    }, []);

    const handleMessageReceived = useCallback(({name, id, message, date}) => {
        const newMessage = {
            name: name,
            id: id,
            message: message,
            date: date,
        }
        setMessages(prevState => [newMessage, ...prevState]);
    }, []);

    const handleMessageSent = useCallback(() => {
        if (message.trim().length > 0)
            socket.emit("textMessage", message);
        setMessage('');
    }, [message, socket])

    const handleIncomingCall = useCallback(async ({from, offer}) => {
        setConnectionStatus('ANSWER_SENT');
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setLocalStream(stream);
        const ans = await RoomService.getAnswer(offer);
        socket.emit("callAccepted", {to: from, ans: ans});
        localVideo.current.srcObject = stream;
    }, [socket]);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setLocalStream(stream);
        setConnectionStatus('OFFER_SENT');
        const offer = await RoomService.getOffer();
        socket.emit("userCall", {to: remoteSocketId, offer});
        localVideo.current.srcObject = stream;
    }, [remoteSocketId, socket]);

    const handleUserJoin = useCallback(async (data) => {
        const {sessionId} = JSON.parse(data);
        setRemoteSocketId(sessionId);
        setUserJoined(true);
    }, []);

    const sendStreams = useCallback(() => {
        localStream.getTracks().forEach(track => {
            RoomService.peer.addTrack(track, localStream);
        });
    }, [localStream]);

    const handleCallAccepted = useCallback(async ({ans}) => {
        await RoomService.setRemoteDescription(ans);
        setConnectionStatus('CONNECTED_INITIATED');
        sendStreams();
    }, [sendStreams]);

    const handleNegotiationNeeded = useCallback(async () => {
        const offer = await RoomService.getOffer();
        setConnectionStatus('NEGOTIATION_INITIATED');
        socket.emit('peerNegotiationNeeded', {offer, to: remoteSocketId});
    }, [remoteSocketId, socket]);

    const handleNegotiationIncoming = useCallback(async ({from, offer}) => {
        const ans = await RoomService.getAnswer(offer);
        setConnectionStatus('NEGOTIATION_ACCEPTED');
        socket.emit("peerNegotiationDone", {to: from, ans});
    }, [socket]);

    const handleNegotiationFinal = useCallback(async ({from, ans}) => {
        await RoomService.setRemoteDescription(ans);
        setConnectionStatus('CONNECTION_ESTABLISHED');
        setShowControls(true);
        socket.emit("notifyPeer", {to: from});
    }, [socket]);

    const handleNegotiationCompleted = useCallback(async () => {
        try {
            sendStreams();
            setConnectionStatus('CONNECTION_ESTABLISHED');
        } catch (error) {
            console.log("Can't add tracks again.")
        }
    }, [sendStreams]);

    const handleEnterPressed = useCallback((e) => {
        if (e.key === "Enter") {
            handleMessageSent();
        }
    }, [handleMessageSent]);

    useEffect(() => {
        RoomService.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
        return () => RoomService.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
    }, [handleNegotiationNeeded, remoteSocketId, socket]);

    useEffect(() => {
        RoomService.peer.addEventListener('track', async e => {
            const stream = e.streams;
            remoteVideo.current.srcObject = stream[0];
        });
    }, []);

    useEffect(() => {
        socket.emit("getAllUsersInRoom");
    }, [socket]);

    useEffect(() => {
        socket.on("userJoined", handleUserJoin);
        socket.on("incomingCall", handleIncomingCall);
        socket.on("callAccepted", handleCallAccepted);
        socket.on("peerNegotiationNeeded", handleNegotiationIncoming);
        socket.on("peerNegotiationFinal", handleNegotiationFinal);
        socket.on("peerNegotiationCompleted", handleNegotiationCompleted);
        socket.on("messageReceived", handleMessageReceived);
        socket.on("roomCountChange", handleRoomCountChange);
        socket.on("allUsers", handleAllUsersReceived);
        socket.on("linkChangeAccept", handleLinkChangeAccept);
        socket.on("play", handlePlayAccept);
        socket.on("pause", handlePauseAccept);
        return () => {
            socket.off("userJoined", handleUserJoin);
            socket.off("incomingCall", handleIncomingCall);
            socket.off("callAccepted", handleCallAccepted);
            socket.off("peerNegotiationNeeded", handleNegotiationIncoming);
            socket.off("peerNegotiationFinal", handleNegotiationFinal);
            socket.off("peerNegotiationCompleted", handleNegotiationCompleted);
            socket.off("messageReceived", handleMessageReceived);
            socket.off("roomCountChange", handleRoomCountChange);
            socket.off("allUsers", handleAllUsersReceived);
            socket.off("linkChangeAccept", handleLinkChangeAccept);
            socket.off("play", handlePlayAccept);
            socket.off("pause", handlePauseAccept);
        }
    }, [handleAllUsersReceived, handleCallAccepted, handleIncomingCall,
        handleMessageReceived, handleNegotiationCompleted, handleNegotiationFinal, handleNegotiationIncoming, handleRoomCountChange, handleUserJoin, socket]);

    useEffect(() => {
        console.log(connectionStatus);
    }, [connectionStatus]);

    return (<div
        className="Room bg-img-1 bg-cover flex flex-col space-x-2 md:flex-row min-h-screen max-h-screen min-w-screen max-w-screen p-2">
        <div className="flex flex-col space-y-2">
            <div className="lg:w-[70rem] lg:h-[35rem] rounded-3xl overflow-hidden">
                <ReactPlayer url={videoLink}
                             ref={player}
                             className="bg-white bg-opacity-50 backdrop-blur-lg w-full h-full rounded-3xl"
                             onPlay={handleVideoPlayed}
                             onPause={handleVideoPaused}
                             width='100%'
                             height='100%'/>
            </div>
            <div className="flex flex-col justify-between bg-white glass shadow-lg
            bg-opacity-50 backdrop-blur-lg rounded-3xl flex-grow">
                <div className="p-2 mx-2 border-down-2 flex-grow flex justify-center items-center">
                    <IconContext.Provider value={{size: 30}}>
                        <div>
                            {!showControls &&
                                <button disabled={!userJoined}
                                        onClick={() => {
                                            handleCallUser();
                                            setShowControls(true);
                                        }
                                        }
                                        className={`${userJoined ? 'animated-border hover:bg-blue-600' : 'opacity-50'} bg-blue-700 flex items-center rounded-full p-2`}>
                                    <AiFillCaretRight/> Start Session
                                </button>}
                            {showControls &&
                                <div
                                    className="flex justify-evenly p-3 space-x-2 bg-blue-700 rounded-3xl text-gray-200">
                                    <button onClick={() => setLinkSet(prevState => !prevState)}
                                            className={`hover:text-gray-400 rounded-full p-2 ${linkSet ? 'transition-transform rotate-90 delay-150' : ''}`}>
                                        <BsThreeDots/></button>
                                    <input
                                        className={`${linkSet ? 'inline' : 'hidden'} p-2 rounded-3xl text-gray-900 animated-expand`}
                                        value={videoLink}
                                        onChange={(e) => {
                                            handleLinkChanged(e)
                                            setVideoLink(e.target.value)
                                        }}/>
                                    <button className="hover:text-gray-400 rounded-full p-2"><AiFillVideoCamera/>
                                    </button>
                                    <button className="hover:text-gray-400 rounded-full p-2"><AiFillAudio/></button>
                                    <button className="hover:text-gray-400 rounded-full p-2"><FcEndCall/></button>
                                </div>
                            }
                        </div>
                    </IconContext.Provider>
                </div>
                <div className="p-2 flex justify-start">
                    12:55 | 12 November 2013 | Room Id: 1 | Host: True
                </div>
            </div>
        </div>
        <div className="glass flex flex-col bg-white bg-opacity-50 shadow-lg backdrop-blur-lg flex-grow rounded-3xl">
            <div
                className="flex bg-gray-500 shadow-2xl bg-opacity-50 justify-evenly backdrop-blur-lg h-10 rounded-t-3xl">
                <button onClick={() => setTab(1)}
                        className={`${tab === 1 ? 'text-blue-700' : ''} flex items-center space-x-1 hover:text-blue-700`}>
                    <AiFillVideoCamera/>
                    <span>Video</span>
                </button>
                <button onClick={() => setTab(2)}
                        className={`${tab === 2 ? 'text-blue-700' : ''} flex items-center space-x-1 hover:text-blue-700`}>
                    <AiFillMessage/>
                    <span>Messages</span>
                </button>
                <button onClick={() => setTab(3)}
                        className={`${tab === 3 ? 'text-blue-700' : ''} flex items-center space-x-1 hover:text-blue-700`}>
                    <AiFillDownCircle/>
                    <span>Users</span>
                </button>
            </div>
            <div>
                <div className={`${tab === 1 ? 'flex' : 'hidden'} flex-col`}>
                    <div className="p-2 space-y-2">
                        <div
                            className="glass bg-white h-[15rem] w-full flex bg-opacity-50 glass1 shadow-xl rounded-3xl">
                            <video ref={localVideo} muted={true} autoPlay={true} className="w-full h-full">
                            </video>
                        </div>
                        <div className="bg-white h-[15rem] w-full flex bg-opacity-50 glass1 shadow-xl rounded-3xl">
                            <video ref={remoteVideo} autoPlay={true} className="w-full h-full">
                            </video>
                        </div>
                    </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        setHidden1(true);
                    }
                    } className={`${hidden1 ? 'hidden' : ''} flex justify-center items-center space-x-1
                    mx-2 bg-blue-600 bg-opacity-50 p-2 rounded-2xl animate-pulse delay-150`}>
                        <AiFillExclamationCircle/>
                        <span
                            className="font-varela-round font-bold text-text-1">
                            Currently supports only 2 connections &#128542;
                        </span>
                    </div>
                </div>
                {tab === 2 &&
                    <div className="p-2 flex flex-col max-h-[42.5rem] min-h-[42.5rem] overflow-y-hidden">
                        <div
                            className="p-2 bg-white flex-grow bg-opacity-50 rounded-3xl space-y-2 flex flex-col justify-end overflow-y-hidden">
                            <ul className="flex-grow overflow-y-scroll px-2 flex flex-col-reverse min-h-max space-y-2 overflow-x-hidden">
                                {messages.map((item, key) => {
                                    return (
                                        <li key={key}
                                            className={`${item.id === socket.id ? 'justify-end' : 'justify-start'} flex flex-shrink text-gray-900 max-w-full mt-2`}>
                                            <TextMessage name={item.name} message={item.message} date={item.date}
                                                         user={item.id === socket.id}/>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className="flex w-full space-x-1">
                                <input type="text"
                                       value={message}
                                       onChange={(e) => setMessage(e.target.value)}
                                       className="flex-grow rounded-3xl p-2 bg-white bg-opacity-90 text-gray-900"
                                       onKeyDown={handleEnterPressed}/>
                                <button
                                    onClick={handleMessageSent}
                                    className="py-2 px-2 text-blue-700 rounded-full hover:bg-gray-400 hover:cursor-pointer">
                                    <BiSend/></button>
                            </div>
                        </div>
                    </div>}
                {tab === 3 &&
                    <div className="p-2 flex flex-col max-h-[42.5rem] min-h-[42.5rem]">
                        <div className="p-2 bg-white flex-grow bg-opacity-50 rounded-3xl space-y-2 flex flex-col">
                            <div
                                className="flex justify-center items-center space-x-1 text-title-3 text-blue-700 font-questrial font-bold border-down-1">
                                <FaUsers/> <span>Present</span>
                            </div>
                            <ul className="flex flex-col space-y-2">
                                {users.map((item, key) => {
                                    return (
                                        <li key={key}
                                            className="flex justify-between text-blue-700 bg-gray-400 bg-opacity-50 rounded-3xl p-2">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="rounded-full bg-blue-700 text-text-1 px-2.5 py-1 font-extrabold capitalize">{item.displayName[0]}</div>
                                                <span
                                                    className="font-bold text-text-1 capitalize">{item.displayName}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <HiStatusOnline size={20}/>
                                                <button className="hover:text-blue-500 hover:cursor-pointer">
                                                    <BsThreeDots size={20}/></button>
                                            </div>
                                        </li>)
                                })}
                            </ul>
                        </div>
                    </div>}
            </div>
        </div>
    </div>);
};

export default Room;