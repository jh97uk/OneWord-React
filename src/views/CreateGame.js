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

const socket = io('http://192.168.0.15:3030');
import { nanoid } from 'nanoid';


const feathersClient = feathers();
feathersClient.configure(feathers.socketio(socket));
const sessions = feathersClient.service('sessions')
const Cookie = new Cookies();


class CreateGameView extends Component {
  
  constructor() {
    super();
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
    sessions.on('created', function (session) {
      console.log(session);
      self.setState({ createdSession: session });
    });
  }

  createGame() {
    console.log(this.state);
    sessions.create(this.state, function () {
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
