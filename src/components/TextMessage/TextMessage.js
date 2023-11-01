import React from 'react';
import './TextMessage.css';

const TextMessage = (props) => {
    return (
        <div className={`${!props.user ? 'bg-blue-700':'bg-neutral-50'} font-varela-round flex flex-col bg-opacity-20 p-2 rounded-xl max-w-[18rem]`}>
            {!props.user && <div className="flex justify-start font-bold text-blue-900">
                {props.name}
            </div>}
            <div className={`${!props.user ? 'justify-start':'justify-end'} wrap`}>
                {props.message}
            </div>
            <div className="flex justify-end text-paragraph-4">
                {props.date}
            </div>
        </div>
    );
};

export default TextMessage;