import React from 'react';
import '../App.css';

function Word(props) {
    if(props.hidden){
        return(<div></div>);
    }
    if(!props.typing){
        console.log(props.userColor);
    }
    return (
    <div className={"word"} style={props.typing ? {backgroundColor:"white"} : {backgroundColor:props.userColor}}>
        <label>{props.word}</label>
        <div style={props.typing ? {display:'block'} : {display:"none"}}>
            <React.Fragment>
                <span style={props.typing ? {backgroundColor:props.userColor} : {display:"none"}} className='typing-dot'></span>
                <span style={props.typing ? {backgroundColor:props.userColor} : {display:"none"}} className='typing-dot'></span>
                <span style={props.typing ? {backgroundColor:props.userColor} : {display:"none"}} className='typing-dot'></span>
            </React.Fragment>
        </div>
    </div>
  );
}

export default Word;
