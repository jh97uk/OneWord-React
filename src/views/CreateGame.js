/* eslint-disable import/first */

import Cookies from 'universal-cookie';

import React, { Component } from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import { Link, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Switch from 'react-switch';
import io from 'socket.io-client';
import feathers from '@feathersjs/client';




class CreateGameView extends Component {
  
  constructor(props) {
    super();

    const socket = props.connection;
    const feathersClient = feathers();
    feathersClient.configure(feathers.socketio(socket));
    
    this.sessions = feathersClient.service('sessions')
    const Cookie = new Cookies();

    this.state = { linkOnly: false, storyTitle: '', sessionOwnerId:Cookie.get('userId')};
    this.handleChange = this.handleChange.bind(this);
    this.createGame = this.createGame.bind(this);
    console.log(this.state);
  }

  handleChange(linkOnly) {
    this.setState({ linkOnly });
  }

  componentDidMount() {
    var self = this;    
    this.sessions.on('created', function (session) {
      console.log(session);
      self.setState({ createdSession: session });
    });
  }

  createGame() {
    console.log(this.state);
    this.sessions.create(this.state, function () {
      alert()
    });
  }

  render() {
    console.log(this.state)
    if (this.state.createdSession) {
      return <Redirect to={"/story/" + this.state.createdSession.id} />
    }
    return (
      <div>
        <AppBar pageTitle="CREATE A GAME" backRoute="/"></AppBar>

        <div className="centeredContainer">
          <input placeholder="PROMPT TITLE" type="text" onChange={event => this.setState({ storyTitle: event.target.value })}></input>

          <ul>
            <li>
              <label>LINK ONLY</label>
              <Switch onChange={this.handleChange} checked={this.state.linkOnly}></Switch>
            </li>
            <li>
              <Ripples color="#9e9e9e" className="fullWidth"><button className="button primary" onClick={this.createGame}>CREATE</button></Ripples>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CreateGameView;
