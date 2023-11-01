import React from 'react';
import './Modal.css';

const Modal = (props) => {
    const checkIfParent = (e) => {
        if (e.target === e.currentTarget) {
            props.action();
        }
    }

    return (
        <div onMouseDown={checkIfParent} className="Modal flex flex-col justify-end md:justify-center md:items-center">
            <div
                className="modal-content z-10 flex flex-col md:w-[30rem] md:h-[20rem] bg-white bg-opacity-20 backdrop-blur-xl rounded-t-3xl md:rounded-xl shadow-2xl">
                {props.children}
            </div>
        </div>
    );
};

export default Modal;