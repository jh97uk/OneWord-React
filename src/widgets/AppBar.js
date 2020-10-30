import React from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import {IconButton} from '@material-ui/core';

function AppBar(props) {
    const buttonStyle = {padding:0, marginLeft:15, color:'white'};
    return (
    <div className="appBar">
        <div className="buttonsLeft">
            {
                props.onBackButtonFunction ? 
                    <IconButton style={buttonStyle} component={(props)=><Link to={props.backRoute}/>}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                    </IconButton>
                    :
                    <IconButton style={buttonStyle} onClick={props.onBackButtonFunction}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft}/>
                    </IconButton>
            }
        </div>
        <h1>{props.pageTitle}</h1>
        <div className="buttonsRight">
        </div>
    </div>
  );
}

export default AppBar;
