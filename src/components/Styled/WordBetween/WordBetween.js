import React from 'react';
import './WordBetween.css'

const WordBetween = (props) => {
    const color = props.color ? props.color : '#777';
    const styles = {
        lineHeight: "0.7rem",
        borderBottom: `1px solid ${color}`,
        width: `${props.width}rem`,
    }

    return (
        <div className="flex space-x-4">
            <div><h1 style={styles}><span className="text-transparent">_______</span></h1>
            </div>
            <span>{props.children}</span>
            <div><h1 style={styles}><span className="text-transparent">_______</span></h1>
            </div>
        </div>
    );
};

export default WordBetween;