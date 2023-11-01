import React, {useEffect, useState} from 'react';
import './Topbar.css';
import {GoPersonFill} from "react-icons/go";

const Topbar = () => {
    const locale = 'en';
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    const today = `${date.getDate()} ${date.toLocaleDateString(locale, {month: 'long', year: 'numeric'})}`;
    const time = `${date.toLocaleTimeString(locale, {hour: 'numeric', minute: 'numeric'})}`

    const [navButStyle, setNavButStyle] = useState('');

    const navButtonClicked = () => {
        setNavButStyle(prev => prev === '' ? 'open-animation' : '');
    }

    return (
        <nav className={`Topbar w-full h-[5rem] bg-gradient-to-b from-gray-950 flex justify-between px-4`}>
            <div className="flex items-center float-left">
                <div className="flex items-center">
                    <div className="w-[2rem] h-[2rem] rounded-full bg-blue-700"></div>
                    <div className="w-[2rem] h-[2rem] rounded-full bg-orange-700 -translate-x-3"></div>
                    <span className="font-questrial text-title-3 font-extrabold">MWP</span>
                </div>
            </div>
            <div className="flex items-center float-right space-x-6">
                <div
                    className="hidden sm:flex font-varela-round text-paragraph-1 text-text-2 space-x-2 tracking-tighter">
                    <span>{time} &#8226; </span>
                    <span>{today}</span>
                </div>
                <div className={`${navButStyle} flex items-center transition-transform delay-150 ease-in`}>
                    <button className={`triangle`} onClick={navButtonClicked}></button>
                </div>
                <button
                    className="flex items-center w-[2.2rem] h-[2.2rem] rounded-full bg-white bg-opacity-30 overflow-clip">
                    <GoPersonFill size={35} color={'rgb(50, 50, 50)'} className="translate-y-1.5"/>
                </button>
            </div>
        </nav>
    );
};

export default Topbar;