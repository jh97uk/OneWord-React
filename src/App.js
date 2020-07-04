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

const Cookie = new Cookies();


function App() {

  if(Cookie.get('userId') == undefined){
    Cookie.set('userId', nanoid(5), {path:'/'});
  }

  return (
    <div className="appContainer">
      <Router>
        <Switch>
        <Route path="/join/random" render={(props)=><JoiningStory {...props}/>}/>
        <Route path="/story/:storyId" render={(props)=><StoryChat {...props}/>}/>
          <Route path="/create">
            <CreateGameView></CreateGameView>
          </Route>
          <Route path="/">
            <HomeView></HomeView>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
