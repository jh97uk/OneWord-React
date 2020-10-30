import React from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import Logo from '../widgets/logo';
import {Button} from '@material-ui/core';

function HomeView() {
  const buttonStyle = {
    width:'100%'
  }
  return (
    <div>
      <Logo></Logo>
        <ul className="mainMenuButtons">
              <li>
                <Button component={(props)=><Link to="/create" {...props}/>} variant="contained" style={buttonStyle} linkButton={true}>CREATE GAME</Button>
              </li>
              <li>
                <Button component={(props)=><Link to="/join/random" {...props}/>} variant="contained" style={buttonStyle} linkButton={true} color="secondary">JOIN RANDOM GAME</Button>
              </li>
        </ul>
    </div>
  );
}

export default HomeView;
