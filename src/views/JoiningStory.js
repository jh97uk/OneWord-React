import React, {Component} from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import ReactLoading from 'react-loading';
import Ripples from 'react-ripples';
import Logo from '../widgets/logo';


class JoiningStory extends React.Component{

  render(props){
    return(
      <div>
            <Logo></Logo>
            <h3 className="statusMessage">Finding story...</h3>
            <div style={{height:'80px', width:'80px', margin:'0px auto', marginTop:'20px'}}>
                <ReactLoading type="bubbles" color="#000" height={80} width={80}></ReactLoading>
            </div>
            <ul className="mainMenuButtons">
              <li>
               <Ripples color="#9e9e9e"><Link to="/" className="button primary">CANCEL</Link></Ripples>
              </li>
            </ul>
          
      </div>
    );
  }
}

export default JoiningStory;
