import React from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';


import Logo from '../widgets/logo';
import Ripples from 'react-ripples';
import CreateGameView from '../views/CreateGame';

function HomeView() {
  return (
    <div>
      <Logo></Logo>
        <ul className="mainMenuButtons">
              <li>
               <Ripples color="#9e9e9e"><Link to="/create" className="button primary">START A GAME</Link></Ripples>
              </li>
              <li>
                <Ripples><Link to="/create" className="button">JOIN RANDOM GAME</Link></Ripples>
              </li>
        </ul>
    </div>
  );
}

export default HomeView;
