/* eslint-disable import/first */

import React, { Component } from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import { Link, BrowserRouter as Router, Redirect } from 'react-router-dom';
import feathers from '@feathersjs/client';
import { Facebook } from 'react-spinners-css';
import { withAlert } from "react-alert";
import OneLib from '../OneLib.js';
import {Button, TextField, Switch} from '@material-ui/core';

class CreateGameView extends Component {
  
  constructor(props) {
    super();

    const socket = props.connection;
    const feathersClient = feathers();
    feathersClient.configure(feathers.socketio(socket));
    
    this.sessions = feathersClient.service('sessions')

    this.state = {loading:false, linkOnly: false, storyTitle: '', sessionOwnerId:props.userId};
    this.handleChange = this.handleChange.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  handleChange(event) {
    this.setState({ linkOnly: event.target.checked});
  }

  componentDidMount() {
    var self = this;    
  }

  createGame() {
    this.setState({loading:true})
    const self = this;
    this.sessions.create({linkOnly:this.state.linkOnly, storyTitle:this.state.storyTitle, sessionOwnerId:this.state.sessionOwnerId}).then(function(session){
      self.setState({loading:false, createdSession: session})
    }, function(error){
      OneLib.showError(self.props.alert, error, function(){
        self.setState({loading:false});
      });
    });
  }

  render() {
    if (this.state.createdSession) {
      return <Redirect to={"/story/" + this.state.createdSession.id} />
    }

    let loadingButton;
    if(this.state.loading){
    } else{
        loadingButton = (
            <Ripples color="#9e9e9e" className="fullWidth"><button onClick={this.createGame} className="button primary"
                            style={{
                                width:'100%',
                                height:'40px',
                                border:'0px',
                                borderRadius:'6px',
                                fontSize:'18px',
                                fontWeight:'500'
                            }}>CREATE</button></Ripples>
        )
    }

    return (
      <div>
        <AppBar pageTitle="CREATE A GAME" backRoute="/"></AppBar>
        <div className="centeredContainer">
          <TextField
            label="PROMPT TITLE"
            variant="outlined"
            onChange={event => this.setState({ storyTitle: event.target.value })}
            style={{width:'100%', marginBottom:15}}/>
          <ul>
            <li>
              <label style={{lineHeight:'38px'}}>LINK ONLY</label>
              <Switch onChange={this.handleChange} checked={this.state.linkOnly}></Switch>
            </li>
            <li style={{textAlign:'center'}}>
              {this.state.loading ? 
              <Facebook color={'black'}></Facebook>
                :
              <Button onClick={this.createGame} variant="contained" style={{width:'100%'}}>CREATE GAME</Button>}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withAlert()(CreateGameView);
