import React from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import {Link, BrowserRouter as Router} from 'react-router-dom';
function AppBar(props) {
    var backLink = (<></>)
    if(props.onBackButtonFunction){
        backLink = (
            <Link onClick={props.onBackButtonFunction}>
             <FontAwesomeIcon icon={faLongArrowAltLeft}/>
            </Link>)
    } else{
        backLink = (
            <Link to={props.backRoute}>
             <FontAwesomeIcon icon={faLongArrowAltLeft}/>
            </Link>)
    }
    
    return (
    <div className="appBar">
        <div className="buttonsLeft">
            {backLink}
        </div>
        <h1>{props.pageTitle}</h1>
        <div className="buttonsRight">
        </div>
    </div>
  );
}

export default AppBar;
