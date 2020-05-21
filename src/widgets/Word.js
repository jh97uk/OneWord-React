import React from 'react';
import '../App.css';

function Word(props) {
    return (
    <div className={"word"}>
        <label>{props.word}</label>
    </div>
  );
}

export default Word;
