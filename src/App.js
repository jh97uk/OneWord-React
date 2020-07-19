/* eslint-disable import/first */

import Cookies from 'universal-cookie';
import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Logo from './widgets/logo';
import Ripples from 'react-ripples';
import CreateGameView from './views/CreateGame';
import HomeView from './views/Home';
import StoryChat from './views/StoryChat';
import JoiningStory from './views/JoiningStory';
import { nanoid } from 'nanoid';
import { positions, Provider } from "react-alert";
import AlertMUITemplate from "react-alert-template-mui";

import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const socket = io('http://192.168.0.15:3030');
const Cookie = new Cookies();
const feathersClient = feathers();
feathersClient.configure(feathers.socketio(socket));
const users = feathersClient.service('users');

function App() {
  users.create({name:"test"})
  users.on('created', function(user){
    Cookie.set('userId', user.id, {path:'/'});
  })

  return (
    <Provider template={AlertMUITemplate}>
      <div className="appContainer">
        <Router>
          <Switch>
          <Route path="/join/random" render={(props)=><JoiningStory {...props}/>}/>
          <Route path="/story/:storyId" render={(props)=><StoryChat {...props} connection={socket}/>}/>
            <Route path="/create">
              <CreateGameView connection={socket}></CreateGameView>
            </Route>
            <Route path="/">
              <HomeView></HomeView>
            </Route>
          </Switch>
        </Router>
      </div>
    </Provider>
    
  );
}

export default App;
