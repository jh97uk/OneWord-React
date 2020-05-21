import React, {Component} from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import Word from '../widgets/Word';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
class StoryChat extends React.Component{

  render(props){
    const words = ['Theresa', 'walked', 'into', 'the', 'field', 'and', 'runs', 'through', 'the', 'wheat', 'fields', 'with', 'a', 'freeing', 'flare', 'and', 'glee'];
    return(
      <div>
          <AppBar pageTitle={this.props.location.storyTitle} backRoute="/create"></AppBar>
          <div className="fullScreen">
              {words.map((value, index)=>{
                  return <Word word={value}/>
              })}
          </div>
      </div>
    );
  }
}

export default StoryChat;
